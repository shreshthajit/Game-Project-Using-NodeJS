const SelfChallenge = require("../../models/selfChallenge");
const UserModel = require("../../models/user");
const { selectUniqueQuestions, findQuestionLevel } = require("../../utils/challenge");
const { createChallengeValidation } = require("../../validations/challenge");

const createSelfChallenge = async (req, res) => {
    try {
        const userId = req.user._id;
        const validation = createChallengeValidation(req.body);
        if (validation.error) {
            return res.status(422).json({ success: false, message: validation.error.details[0].message });
        }

        const userA = await UserModel.findById(userId);
        if (userA?.score > 10) {
            const resp = {
                status: false,
                message: "Sorry! You already have a 10+ score to start a challenge",
            };
            return res.status(404).send(resp);
        }

        //...............select question based on level..........................
        let questions = await findQuestionLevel(userA);
        if (!Array.isArray(questions) || questions.length === 0) {
            const resp = {
                status: false,
                message: "No questions found for your specified level",
            };
            return res.status(404).send(resp);
        }


        const topicWiseQuestion = questions.filter(q => q.topic === req.body.topic);
        const selectedQuestions = selectUniqueQuestions(topicWiseQuestion);

        // let questionWithoutAns = selectedQuestions.map(q => {
        //     const optionsWithoutAns = q?.options?.map(({ option }) => ({ option }));
        //     if (optionsWithoutAns && q?.options) {
        //         q.options = optionsWithoutAns;
        //     }
        //     return q;
        // });
        const userData = {
            userId: userA._id,
            topic: req.body.topic,
            questions: selectedQuestions,
        };
        const result = await SelfChallenge.create(userData);

        const resp = {
            success: true,
            data: result
        };
        res.status(201).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

const getSelfChallenges = async (req, res) => {
    try {
        const userId = req.user._id;
        const challenges = await SelfChallenge.find({ userId: userId }).sort({ createdAt: -1 });
        const resp = {
            success: true,
            data: challenges
        };
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

module.exports = { createSelfChallenge, getSelfChallenges };












