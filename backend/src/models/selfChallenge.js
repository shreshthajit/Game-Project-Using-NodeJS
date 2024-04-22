const mongoose = require('mongoose');

const questionAndAnswers = new mongoose.Schema({
    questionId: String,
    answer: Number,
    _id: false,
});

const selfChallengeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    topic: {
        type: String,
        required: true,
        index: true
    },
    questions: mongoose.Schema.Types.Mixed,
    result: {
        type: Number,
        default: 0
    },
    submissions: [questionAndAnswers],
    submittedTime: Date,
}, { timestamps: true, versionKey: false });

const SelfChallenge = mongoose.model('self-challenge ', selfChallengeSchema);
module.exports = SelfChallenge;
