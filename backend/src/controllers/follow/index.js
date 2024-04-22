const FollowModel = require("../../models/follow");
const UserModel = require("../../models/user");

const addFollowing = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'Provide a valid userId' });
        } else if (userId === req.user._id) {
            return res.status(400).json({ success: false, message: 'You can not follow yourself' });
        }

        const user = await UserModel.findOne({ _id: userId }).lean();
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid userId. Failed to find the user' });
        }

        const result = await FollowModel.create({
            userId: req.user._id,
            followingId: userId,
        });
        if (!result) {
            return res.status(400).json({ success: false, message: 'Failed to add a following' });
        }
        const resp = {
            success: true,
            data: result,
        };
        res.status(201).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};


const getFollowing = async (req, res, next) => {
    const { page = 1, limit = 20, ...rest } = req.query;
    try {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            await FollowModel.find({
                ...rest,
                userId: req.user._id
            }).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
            await FollowModel.countDocuments({
                ...rest,
                userId: req.user._id
            })
        ]);
        const followingUsers = [];
        for await (const user of users) {
            const userId = user.followingId;
            const follow = await UserModel.findOne({ _id: userId, role: 'user' }, { id: 1, name: 1, city: 1, college: 1, level: 1, skills: 1, image: 1, socialImage: 1 });
            if (follow) {
                if (follow.image) {
                    follow.image = await getPresignedUrl(follow.image);
                }
                followingUsers.push(follow);
            }
        }
        const resp = {
            success: true,
            data: {
                users: followingUsers,
                pageCount: Math.ceil(total / limit),
            },
        };
        res.status(200).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

module.exports = { addFollowing, getFollowing };
