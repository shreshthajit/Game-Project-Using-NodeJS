const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: null,
    },
    challengeId: {
        type: String,
        required: true,
    },
    topic: String,
    sender: {
        id: String,
        name: {
            type: String,
            default: null,
        },
        image: {
            type: String,
            default: null,
        },
        socialImage: String,
    },
    receiver: {
        id: String,
        name: {
            type: String,
            default: null,
        },
        image: {
            type: String,
            default: null,
        },
        socialImage: String,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
    versionKey: false,
});

NotificationSchema.index({ 'sender.id': 1, 'receiver.id': 1 });
const NotificationModel = mongoose.model('notification', NotificationSchema);
module.exports = NotificationModel;

