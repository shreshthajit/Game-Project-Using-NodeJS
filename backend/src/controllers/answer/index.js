// Import necessary modules
const { Types } = require("mongoose");
const Challenge = require("../../models/challenge");
const NotificationModel = require("../../models/notification");
const Question = require("../../models/question");
const SelfChallenge = require("../../models/selfChallenge");
const UserModel = require("../../models/user");
const { answerValidation, selfChallengeAnswerValidation, checkAnswerValidation } = require("../../validations/qAndA");
const CoinModel = require("../../models/coin");
const { sendNotification } = require("../../utils/notification");

const submitAnswer = async (req, res) => {
    const validation = answerValidation(req.body);
    if (validation.error) {
        return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }

    try {
        const userId = req.user._id;
        const { challengeId, topic, answers } = req.body;

        const [userA, challenge] = await Promise.all([
            UserModel.findById(userId),
            Challenge.findOne({ _id: challengeId, $or: [{ fromUser: userId }, { toUser: userId }] }).lean(),
        ]);

        if (!challenge || (!challenge?.submittedBy?.fromUser && challenge?.toUser === userId)) {
            // Handle case where the challenge is not found
            const resp = {
                success: false,
                error: {
                    message: (!challenge?.submittedBy?.fromUser && challenge?.toUser === userId) ? "Answers to the challenge were not submitted by the first user" : "Challenge not found",
                }
            };
            return res.status(404).json(resp);
        }

        // Check if the challenge has expired
        const createdAtTime = new Date(challenge.createdAt).getTime(); // Convert createdAt to milliseconds
        const currentTime = Date.now(); // Current time in milliseconds
        const hoursElapsed = (currentTime - createdAtTime) / (1000 * 60 * 60); // Calculate hours elapsed

        if (hoursElapsed >= 24) {
            // Challenge has expired
            const resp = {
                success: false,
                error: {
                    message: "Challenge has expired",
                }
            };
            return res.status(400).json(resp);
        }
        if (!challenge || !userA || challenge?.submittedBy?.toUser === userId || challenge?.submittedBy?.fromUser === userId) {
            const resp = {
                status: false,
                message: !userA ? "No User found" :
                    (challenge?.submittedBy?.toUser === userId || challenge?.submittedBy?.fromUser === userId) ?
                        "Already submitted your answers" :
                        "No Challenge found",
            };
            return res.status(404).send(resp);
        }
        let result = 0;

        await Promise.all(answers.map(async (q) => {
            const question = await Question.findById(q.questionId).lean();
            if (!question || !question?.options) {
                throw new Error(`Invalid question ID: ${q.questionId}`);
            }
            let correctIndex = "";

            for (let i = 0; i < question.options.length; i++) {
                if (question.options[i].isCorrect === true) {
                    correctIndex = question.options[i]._id;
                    break;
                }
            }

            if (q.answer === correctIndex?.toString()) {
                result += 5;
            } else {
                result -= 2;
            }
        }));

        //...................now add the skill and their corresponding point..........................
        const user = await UserModel.findOneAndUpdate(
            { _id: userId, 'skill': { $elemMatch: { subject: topic } } },
            { $inc: { 'skill.$.point': result } },
            { new: true }
        ).lean();


        if (!user) {
            // If the user doesn't exist or the subject doesn't exist, add a new skill
            await UserModel.findOneAndUpdate(
                { _id: userId },
                { $push: { 'skill': { subject: topic, point: result, percentage: 100 } } },
                { new: true }
            ).lean();
        }

        // now calculate the percentage of those skill from whoever participated this game.......
        // Calculate User Percentages
        await calculateUserPercentages(topic);

        //........add the result to the overall score
        if (challenge.toUser === userId) {
            userA.score += result;
            userA.score = Math.max(0, userA.score);

            const userBB = await UserModel.findById(challenge.toUser);
            userBB.score += challenge?.result?.from;
            userBB.score = Math.max(0, userBB.score);
            await userBB.save();
        }
        userA.lastPlayed = new Date();
        await userA.save();

        // Update Challenge Results
        const challengeResultField = challenge.fromUser === userId ? 'result.from' : 'result.to';
        const submittedByField = challenge.fromUser === userId ? 'submittedBy.fromUser' : 'submittedBy.toUser';

        let winner = null;
        if (challenge.toUser === userId && challenge?.result?.from !== challenge?.result?.to) {
            winner = challenge?.result?.from > result ? challenge.fromUser : challenge.toUser;
        }
        await Challenge.findOneAndUpdate(
            { _id: challengeId },
            {
                $set: {
                    [challengeResultField]: result,
                    [submittedByField]: userId,
                    ...(winner && { winner }),
                    ...(challenge?.fromUser === userId && { 'submissions.from': answers }),
                    ...(challenge?.toUser === userId && { 'submissions.to': answers }),
                }
            },
            { new: true })
            .lean();

        // handle other users level
        handleOtherUserLevel();

        if (challenge?.fromUser === userId) {
            // send notification
            sendChallengeNotification({
                sender: {
                    id: userA._id,
                    name: userA.name,
                    image: userA?.image,
                    socialImage: userA?.socialImage
                },
                topic: challenge.topic,
                toUserId: challenge.toUser,
                challengeId: challengeId,
                title: `${userA.name} challenged you in ${challenge.topic}`
            });
        } else if (winner) {
            const userBInfo = await UserModel.findById(winner);
            // send notification
            sendChallengeNotification({
                sender: {
                    id: userBInfo._id,
                    name: userBInfo.name,
                    image: userBInfo?.image,
                    socialImage: userBInfo?.socialImage
                },
                topic: challenge.topic,
                toUserId: challenge.fromUser,
                challengeId: challengeId,
                title: `${userBInfo.name} won a challenge in ${challenge.topic}`
            });
        } else if (!winner) {
            const userBInfo = await UserModel.findById(challenge.toUser);
            // send notification
            sendChallengeNotification({
                sender: {
                    id: userBInfo._id,
                    name: userBInfo.name,
                    image: userBInfo?.image,
                    socialImage: userBInfo?.socialImage
                },
                topic: challenge.topic,
                toUserId: challenge.fromUser,
                challengeId: challengeId,
                title: `Challenge is tied in ${challenge.topic}`
            });
        }
        const coinUser = await CoinModel.findById(userId);

        if (coinUser) {
            coinUser.coins = userA.score;
            await coinUser.save();
        } else {
            await CoinModel.create({ userId, coins: userA.score });
        }

        // response
        const resp = {
            success: true,
            data: {
                score: result,
                ...(challenge.toUser === userId && { opponent : challenge.result?.from })
            }
        };
        res.status(201).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

const deductScore = async (req, res) => {
    try {
        const userId = req.user._id;
        const userA = await UserModel.findById(userId);

        userA.score -= 5;
        userA.score = Math.max(0, userA.score);
        userA.lastPlayed = new Date();
        const updatedUser = await userA.save();

        // response
        const resp = {
            success: true,
            data: {
                score: updatedUser.score
            }
        };
        res.status(201).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

const sendChallengeNotification = async ({
    sender,
    challengeId,
    toUserId,
    title,
    topic,
}) => {
    const receiver = await UserModel.findOne({ _id: toUserId }).lean();
    if (!receiver || !receiver?._id) {
        return;
    }
    // Notification Sender Payload
    const payload = {
        title: title,
        // content: `${sender.name} has thrown a challenge.`,
        token: receiver?.fcmToken,
        isHighPriority: true,
        data: {},
        challengeId: challengeId,
    };
    await NotificationModel.create({
        ...payload,
        topic,
        sender,
        receiver: {
            id: receiver?._id,
            name: receiver?.name,
            image: receiver?.image,
            socialImage: receiver?.socialImage
        }
    })
    if (receiver?.fcmToken) {
        await sendNotification(payload);
    }
}

const calculateUserPercentages = async (topic) => {
    // Fetch users with the specified topic
    const usersWithTopic = await UserModel.find({ 'skill': { $elemMatch: { subject: topic } } }, { _id: 1, 'skill.$': 1 })
        .sort({ 'skill.point': -1 })
        .lean();

    let usersWithTopicLen = usersWithTopic.length;
    let topxPercent = Math.ceil(usersWithTopicLen / 10);
    let currentIndx = 0;

    // Calculate percentages in chunks of 10%
    for (let i = 10; i <= 100; i += 10) {
        topxPercent = Math.max(1, Math.ceil((usersWithTopicLen * i) / 100));

        for (let j = currentIndx; j < topxPercent; j++) {
            const user = usersWithTopic[j];
            const skillIndex = user.skill.findIndex(c => c.subject === topic);

            if (skillIndex !== -1) {
                user.skill[skillIndex].percentage = i;
            }

            await UserModel.updateOne(
                { _id: user._id, 'skill.subject': topic },
                { $set: { 'skill.$.percentage': i } }
            );
        }
        currentIndx = topxPercent;
    }
};

const handleOtherUserLevel = async () => {
    //.....................update every user level after this challenge.......................
    const userList = await UserModel.find({ role: 'user' }).sort({ score: -1 }).lean();
    let len = userList.length;
    let topxPercent = Math.ceil(len / 10);
    let currentIndex = 0;
    let totalLevel = 10;
    for (let i = 10; i <= 100; i += 10) {
        topxPercent = Math.ceil((len * i) / 100);

        for (let j = currentIndex; j < topxPercent; j++) {
            let levl = totalLevel;
            userList[j].level = "Level" + levl?.toString();
            await UserModel.updateOne({ _id: userList[j]._id }, { $set: { level: userList[j].level } });
        }

        totalLevel--;
        currentIndex = topxPercent;
    }
}

const checkAnswer = async (req, res) => {
    const validation = checkAnswerValidation(req.body);
    if (validation.error) {
        return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }
    const userId = req.user._id;
    const { challengeId, questionId, answer } = req.body;
    try {
        const challenge = await Challenge.findOne({ _id: challengeId, 'questions._id': new Types.ObjectId(questionId), $or: [{ fromUser: userId }, { toUser: userId }] }).lean();
        if (!challenge) {
            const resp = {
                status: false,
                message: "No Challenge found",
            };
            return res.status(404).send(resp);
        }
        const answerResponse = await Question.findOne({ _id: questionId }).lean();
        let isCorrect = false;
        for await (const answerRes of answerResponse.options) {
            if (answerRes.option === answer && answerRes.isCorrect === true) {
                isCorrect = true;
                break;
            }
        }

        const resp = {
            success: true,
            data: {
                isCorrect,
            },
        };
        res.status(201).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

const challengeExpiry = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const challengeTo = await Challenge.findOne({ _id: challengeId }).lean();

        if (Date.now() - challengeTo?.createdAt <= 24 * 60 * 60 * 1000) {
            const resp = {
                success: true,
                data: {
                    message: "This challenge is valid",
                }
            };
            return res.status(200).json(resp)
        }
        const resp = {
            success: false,
            data: {
                message: "This challenge is expired",
            }
        };
        return res.status(400).json(resp)
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }

};

const selfChallengeAnswer = async (req, res) => {
    const validation = selfChallengeAnswerValidation(req.body);
    if (validation.error) {
        return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }

    try {
        const userId = req.user._id;
        const { challengeId, topic, answers } = req.body;

        const [userA, challenge] = await Promise.all([
            await UserModel.findById(userId),
            await SelfChallenge.findOne({ _id: challengeId, userId }).lean(),
        ]);
        if (!challenge || !userA || challenge?.submittedTime) {
            const resp = {
                status: false,
                message: !userA ? "No User found" :
                    (challenge?.submittedTime) ?
                        "Already submitted your answers" :
                        "No Challenge found",
            };
            return res.status(404).send(resp);
        }
        let result = 0;

        await Promise.all(answers.map(async (q) => {
            const question = await Question.findById(q.questionId).lean();
            if (!question || !question?.options?.length) {
                throw new Error(`Invalid question ID: ${q.questionId}`);
            }
            let correctIndex = "";

            for (let i = 0; i < question.options.length; i++) {
                if (question.options[i].isCorrect === true) {
                    correctIndex = question.options[i]._id;
                    break;
                }
            }

            if (q.answer === correctIndex?.toString()) {
                result += 5;
            } else {
                result -= 2;
            }
        }));

        //...................now add the skill and their corresponding point..........................
        const user = await UserModel.findOneAndUpdate(
            { _id: userId, 'skill': { $elemMatch: { subject: topic } } },
            { $inc: { 'skill.$.point': result } },
            { new: true }
        ).lean();
        if (!user) {
            // If the user doesn't exist or the subject doesn't exist, add a new skill
            await UserModel.findOneAndUpdate(
                { _id: userId },
                { $push: { 'skill': { subject: topic, point: result, percentage: 100 } } },
                { new: true }
            ).lean();
        }

        //........add the result to the overall score
        userA.score += result;
        userA.score = Math.max(0, userA.score);
        await userA.save();

        // Update Challenge Results
        await SelfChallenge.findOneAndUpdate({ _id: challengeId }, { $set: { result, submittedTime: new Date(), submissions: answers } }, { new: true }).lean();

        // response
        const resp = {
            success: true,
            data: {
                score: result,
            }
        };
        res.status(201).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

module.exports = { submitAnswer, selfChallengeAnswer, challengeExpiry, checkAnswer, deductScore };
