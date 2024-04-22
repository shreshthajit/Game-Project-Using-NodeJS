
const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    followingId: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const FollowModel = mongoose.model('follow', FollowSchema);
module.exports = FollowModel;
