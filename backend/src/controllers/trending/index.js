const Challenge = require("../../models/challenge");
const TrendingModel = require("../../models/trending");
const { findUser } = require("../../services/user");

const getRecentPlay = async (req, res) => {
    try {
        const userId = req.user._id;
        const challenges = await Challenge.find({
            $or: [
                { fromUser: userId },
                { toUser: userId }
            ]
        }).sort({ createdAt: -1 }).limit(5).lean();

        for await (const challenge of challenges) {
            challenge.fromUser = challenge?.fromUser && await findUser({ id: challenge.fromUser });
            challenge.toUser = challenge?.toUser && await findUser({ id: challenge.toUser });
        }
        const resp = {
            success: true,
            data: challenges
        };
        return res.status(200).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

const getTrendingTopic = async (req, res) => {
    try {
        const data = await TrendingModel.find({}).sort({ topicUsed: -1 }).lean();
        const resp = {
            success: true,
            data: data
        };
        return res.status(200).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

module.exports = { getRecentPlay, getTrendingTopic };
