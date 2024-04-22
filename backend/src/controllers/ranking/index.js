// Import necessary modules
const UserModel = require("../../models/user");
const { getPresignedUrl } = require("../../utils/s3");

const getTopThreePlayer = async (req, res) => {
    try {
        const users = await UserModel.find({ role: 'user' }, { password: 0, role: 0, fcmToken: 0 }).sort({ score: -1 }).limit(3).lean();
        for await (const user of users) {
            if (user.image) {
                user.image = await getPresignedUrl(user.image);
            }
        }
        const resp = {
            success: true,
            data: users
        };
        res.status(200).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

const getAllPlayer = async (req, res) => {
    try {
        const userId = req.user._id;
        const users = await UserModel.find({ role: 'user' }, { password: 0, role: 0, fcmToken: 0 }).sort({ score: -1 }).lean();
        let i = 1;
        for await (const user of users) {
            user.ranking = i;
            i++;
            if (user.image) {
                user.image = await getPresignedUrl(user.image);
            }
            if (user._id?.toString() === userId) {
                user.isMe = true;
            }
        }
        const resp = {
            success: true,
            data: users
        };
        res.status(200).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

module.exports = { getTopThreePlayer, getAllPlayer };
