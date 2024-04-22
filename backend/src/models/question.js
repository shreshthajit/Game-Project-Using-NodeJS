const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    option: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    }
});

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Give a question title'],
        index: true,
    },
    level: {
        type: String,
        required: [true, 'Give the level of this question'],
        enum: ['easy1', 'easy2', 'easy3', 'mid1', 'mid2', 'mid3', 'hard1', 'hard2', 'hard3'],
        index: true,
    },
    topic: {
        type: String,
        required: [true, 'Give the level of this question'],
        index: true,
    },
    skill: {
        type: [String],
        required: [true, 'Give the skill of this question'],
        index: true,
    },
    options: {
        type: [optionSchema]
    },
    points: {
        type: Number,
        default: 5,
        required: true,
    },
    timer: {
        type: Number,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});

const Question = mongoose.model('question', questionSchema);
module.exports = Question;
