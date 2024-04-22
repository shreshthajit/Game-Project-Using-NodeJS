const Question = require("../models/question");


const findQuestionLevel = async (userA) => {
    let questions = {};
    if (userA.level === "Level1") {
        questions = await Question.find({ level: "easy1" }).lean();
    }
    else if (userA.level === "Level2") {
        questions = await Question.find({ level: "easy2" }).lean();
    }
    else if (userA.level === "Level3") {
        questions = await Question.find({ level: "easy3" }).lean();
    }
    else if (userA.level === "Level4") {
        questions = await Question.find({ level: "mid1" }).lean();
    }
    else if (userA.level === "Level5") {
        questions = await Question.find({ level: "mid2" }).lean();
    }
    else if (userA.level === "Level6") {
        questions = await Question.find({ level: "mid3" }).lean();
    }
    else if (userA.level === "Level7") {
        questions = await Question.find({ level: "hard1" }).lean();
    }
    else if (userA.level === "Level8") {
        questions = await Question.find({ level: "hard2" }).lean();
    }
    else if (userA.level === "Level9") {
        questions = await Question.find({ level: "hard3" }).lean();
    }
    else if (userA.level === "Level10") {
        questions = await Question.find({ level: "hard3" }).lean();
    }
    if (questions.length === 0) {
        return {};
    }
    return questions;
}

const getRandomQuestions = async (count = 5) => {
    try {
        const randomQuestions = await Question.aggregate([
            { $sample: { size: count } },
        ]);

        return randomQuestions;
    } catch (error) {
        console.error('Error finding random questions:', error);
        throw error;
    }
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


const selectUniqueQuestions = (allQuestions, count = 5) => {
    if (count > allQuestions.length) {
        throw new Error('Not enough questions available');
    }

    const shuffledQuestions = shuffleArray(allQuestions);
    const selectedQuestions = new Set();

    for (let i = 0; i < count; i++) {
        selectedQuestions.add(shuffledQuestions[i]);
    }

    return Array.from(selectedQuestions);
}

module.exports = { selectUniqueQuestions, findQuestionLevel, getRandomQuestions };