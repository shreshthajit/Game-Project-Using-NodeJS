// Import necessary modules
const projectConfig = require("../../config");
const Challenge = require("../../models/challenge");
const TrendingModel = require("../../models/trending");
const UserModel = require("../../models/user");
const { selectUniqueQuestions, findQuestionLevel, getRandomQuestions } = require("../../utils/challenge");
const { createChallengeValidation } = require("../../validations/challenge");
const languages = require("../../data/language.json");
const { getPresignedUrl } = require("../../utils/s3");

const getLanguages = async (req, res) => {
  const topic = req.query.topic;
  const resp = {
    success: true,
    data: !topic ? languages.map(language => {
      return {
        img: language.img,
        value: language.key
      }
    }) : languages.find(language => language.key === topic)?.values
  };
  res.status(200).json(resp);
}

const getRandomUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { opponentId } = req.query;
    if (opponentId === userId) {
      const resp = {
        status: false,
        message: "You can not pass your ID as an opponentId",
      };
      return res.status(400).send(resp);
    }

    let [userA, opponentInfo] = await Promise.all([
      await UserModel.findOne({ _id: userId }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean(),
      opponentId && await UserModel.findOne({ _id: opponentId }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean()
    ]);

    if (opponentId && !opponentInfo) {
      const resp = {
        status: false,
        message: "Invalid opponent user id",
      };
      return res.status(400).send(resp);
    }
    if (opponentId) {
      if (userA.image) {
        userA.image = await getPresignedUrl(userA.image);
      }
      if (opponentInfo.image) {
        opponentInfo.image = await getPresignedUrl(opponentInfo.image);
      }
      const resp = {
        success: true,
        data: { me: userA, opponent: opponentInfo }
      };
      return res.status(200).json(resp);
    }

    const city = userA.city;
    const college = userA.college;

    let [availableUsers, newUsers] = await Promise.all([
      UserModel.find({
        _id: { $ne: userId },
        role: 'user',
        ...(city && { city }),
        ...(college && { college }),
        $or: [
          { lastPlayed: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
          { lastPlayed: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) } },
        ],
      }).lean(),
      UserModel.find({ _id: { $ne: userId }, role: 'user' }).sort({ createdAt: -1 }).limit(10).lean()
    ]);

    if (availableUsers.length === 0 && newUsers.length === 0) {
      const resp = {
        status: false,
        message: "No users found",
      };
      return res.status(404).send(resp);
    } else if (availableUsers.length === 0) {
      availableUsers = newUsers;
    }


    let userIds = {};
    let userB = "";

    userIds = availableUsers.map((c) => c._id);
    //................find opponent below my Level or above my level...........................................................
    const userLevel = userA.level;
    const temp = userLevel;
    const match = temp.match(/\d+/);
    const levelIndex = Number(match[0]);

    let low = levelIndex, high = levelIndex + 1;

    while (low > 0 || high <= 10) {
      const lowLevel = "Level" + low?.toString();
      if (low < 0) {
        low = 0;
      }

      let foundLowLevelUsers = {};
      if (low > 0) {
        foundLowLevelUsers = availableUsers.filter(c => c.level === lowLevel);
      }

      const highLevel = "Level" + high?.toString();
      let foundHighLevelUsers = {};
      if (high <= 10) {
        foundHighLevelUsers = availableUsers.filter(c => c.level === highLevel);
      }

      if (foundLowLevelUsers.length) {
        const usrIndx = Math.floor(Math.random() * foundLowLevelUsers.length);
        const userIDs = foundLowLevelUsers.map((c) => c._id);
        const lowLevelUsrId = userIDs[usrIndx];
        userB = lowLevelUsrId;
        break;
      }
      else if (foundHighLevelUsers.length) {
        const usrIndx = Math.floor(Math.random() * foundHighLevelUsers.length);
        const userIDs = foundHighLevelUsers.map((c) => c._id);
        const highLevelUsrId = userIDs[usrIndx];
        userB = highLevelUsrId;
        break;
      }
      else {
        low--;
        high++;
      }
    }

    if (userB.length === 0) {
      const userIndex2 = Math.floor(Math.random() * userIds.length);
      userB = userIds[userIndex2];
    }

    const opponent = await UserModel.findOne({ _id: userB }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean();
    if (userA.image) {
      userA.image = await getPresignedUrl(userA.image);
    }
    if (opponent.image) {
      opponent.image = await getPresignedUrl(opponent.image);
    }
    const resp = {
      success: true,
      data: { me: userA, opponent }
    };
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
}

const createChallenge = async (req, res) => {
  try {
    const { opponentId, topic } = req.body;
    const validation = createChallengeValidation(req.body);
    if (validation?.error) {
      return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }
    if (opponentId === req.user._id) {
      const resp = {
        status: false,
        message: "You cannot throw a challenge at yourself",
      };
      return res.status(400).send(resp);
    }
    let userA = await UserModel.findById({ _id: req.user._id }).lean();

    //...............select question based on level........................................................................
    let questions = await findQuestionLevel(userA);

    if (!Array.isArray(questions) || questions.length === 0) {
      // If no questions found, get 5 random questions
      questions = await getRandomQuestions(5);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      const resp = {
        status: false,
        message: "No questions found for your specified level",
      };
      return res.status(404).send(resp);
    }

    let topicWiseQuestion = questions.filter(q => q.topic === req.body.topic);
    // if (topicWiseQuestion.length === 0) {
    //   topicWiseQuestion = questions;
    // }

    //................................Select a certain number of unique questions......................................
    const selectedQuestion = selectUniqueQuestions(topicWiseQuestion, projectConfig.challenge.questionCount);

    // const questionWithoutAns = selectedQuestion.map(q => {
    //   const optionsWithoutAns = q?.options?.map(({ option }) => ({ option }));
    //   if (optionsWithoutAns && q?.options) {
    //     q.options = optionsWithoutAns;
    //   }
    //   return q;
    // });

    const userData = {
      fromUser: req.user._id,
      toUser: opponentId,
      topic: topic,
      questions: selectedQuestion,
    }
    const result = await Challenge.create(userData);

    // handle trending challenge
    handleTrendingChallenge(topic);

    const resp = {
      success: true,
      data: result
    };
    res.status(201).send(resp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
};

const handleTrendingChallenge = async (topic) => {
  //.................................update the trending model...........................................
  const filter = { topic };
  const update = { $inc: { topicUsed: 1 } };
  const updatedTrendingData = await TrendingModel.findOneAndUpdate(filter, update, { new: true }).lean();

  // If the document does not exist, create it with the initial values
  if (!updatedTrendingData) {
    const trendingData = {
      topic,
      topicUsed: 1
    };
    await TrendingModel.create(trendingData);
  }
}

const getChallenges = async (req, res) => {
  try {
    const userId = req.user._id;
    const challenges = await Challenge.find({ $or: [{ toUser: userId }, { fromUser: userId }] }).sort({ createdAt: -1 }).lean();
    for await (const challenge of challenges) {
      const [userA, userB, winner] = await Promise.all([
        await UserModel.findOne({ _id: challenge.fromUser }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean(),
        await UserModel.findOne({ _id: challenge.toUser }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean(),
        challenge?.winner && await UserModel.findOne({ _id: challenge.winner }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean(),
      ]);
      if (challenge.fromUser === userId && challenge?.submissions?.from) {
        challenge.submissions = {
          from: challenge.submissions.from,
        }
      } else {
        challenge.submissions = [];
      }
      if (!challenge?.submissions?.from) {
        if (challenge.toUser === userId && challenge?.submissions?.to) {
          challenge.submissions = {
            to: challenge.submissions.to,
          }
        } else {
          challenge.submissions = [];
        }
      }

      if (userA.image) {
        userA.image = await getPresignedUrl(userA.image);
      }
      if (userB.image) {
        userB.image = await getPresignedUrl(userB.image);
      }
      if (winner?.image) {
        winner.image = await getPresignedUrl(winner.image);
      }

      challenge.fromUser = userA;
      challenge.toUser = userB;
      if (winner) {
        challenge.winner = winner;
      }
    }
    const resp = {
      success: true,
      data: challenges
    };
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
};

const getChallenge = async (req, res) => {
  try {
    const userId = req.user._id;
    const challengeId = req.params.id;
    const challenge = await Challenge.findOne({ _id: challengeId, $or: [{ toUser: userId }, { fromUser: userId }] }).lean();
    if (!challenge) {
      const resp = {
        status: false,
        message: "No Challenge found",
      };
      return res.status(404).send(resp);
    }
    const [userA, userB, winner] = await Promise.all([
      await UserModel.findOne({ _id: challenge.fromUser }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean(),
      await UserModel.findOne({ _id: challenge.toUser }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean(),
      challenge?.winner && await UserModel.findOne({ _id: challenge.winner }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean(),
    ]);
    if (challenge.fromUser === userId && challenge?.submissions?.from) {
      challenge.submissions = {
        from: challenge.submissions.from,
      }
    } else {
      challenge.submissions = [];
    }
    if (!challenge?.submissions?.from) {
      if (challenge.toUser === userId && challenge?.submissions?.to) {
        challenge.submissions = {
          to: challenge.submissions.to,
        }
      } else {
        challenge.submissions = [];
      }
    }

    if (userA.image) {
      userA.image = await getPresignedUrl(userA.image);
    }
    if (userB.image) {
      userB.image = await getPresignedUrl(userB.image);
    }
    if (winner?.image) {
      winner.image = await getPresignedUrl(winner.image);
    }

    challenge.fromUser = userA;
    challenge.toUser = userB;
    if (winner) {
      challenge.winner = winner;
    }
    const resp = {
      success: true,
      data: challenge
    };
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const challengeId = req.params.id;

    const challenge = await Challenge.findOne({ _id: challengeId, $or: [{ toUser: userId }, { fromUser: userId }] }).lean();

    if (challenge && challenge.submittedBy) {
      delete challenge.submittedBy;
    }

    if (!challenge) {
      const resp = {
        status: false,
        message: "No Challenge found",
      };
      return res.status(404).send(resp);
    }

    const [userA, userB, winner] = await Promise.all([
      await UserModel.findOne({ _id: challenge.fromUser }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean(),
      await UserModel.findOne({ _id: challenge.toUser }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean(),
      challenge?.winner && await UserModel.findOne({ _id: challenge.winner }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 }).lean(),
    ]);


    if (challenge.fromUser === userId && challenge?.submissions?.from) {
      challenge.submissions = {
        from: challenge.submissions.from,
      }
    } else {
      challenge.submissions = [];
    }
    if (!challenge?.submissions?.from) {
      if (challenge.toUser === userId && challenge?.submissions?.to) {
        challenge.submissions = {
          to: challenge.submissions.to,
        }
      } else {
        challenge.submissions = [];
      }
    }

    if (userA.image) {
      userA.image = await getPresignedUrl(userA.image);
    }
    if (userB.image) {
      userB.image = await getPresignedUrl(userB.image);
    }
    if (winner?.image) {
      winner.image = await getPresignedUrl(winner.image);
    }

    challenge.fromUser = userA;
    challenge.toUser = userB;
    if (winner) {
      challenge.winner = winner;
    }
    const resp = {
      success: true,
      data: challenge
    };
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }

}

module.exports = { getLanguages, getRandomUser, createChallenge, getChallenges, getChallenge, getHistory };