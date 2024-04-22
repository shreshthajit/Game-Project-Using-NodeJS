const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireTime: Number,
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
    versionKey: false,
});

const OTPModel = mongoose.model('otp', OTPSchema);
module.exports = OTPModel;

