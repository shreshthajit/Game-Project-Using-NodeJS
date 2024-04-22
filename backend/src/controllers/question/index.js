const Question = require("../../models/question");
const { createQuestionValidation, updateQuestionValidation } = require("../../validations/qAndA");

const createQuestion = async (req, res) => {
    try {
        const validation = createQuestionValidation(req.body);
        if (validation.error) {
            return res.status(422).json({ success: false, message: validation.error.details[0].message });
        }

        const result = await Question.create(req.body);
        if (!result) {
            return res.status(400).json({ success: false, message: 'Failed to add a question' });
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

const updateAQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const validation = updateQuestionValidation(req.body);
        if (validation.error || !id) {
            return res.status(422).json({ success: false, message: !id ? 'Provide a valid question id' : validation.error.details[0].message });
        }

        const result = await Question.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (!result) {
            return res.status(400).json({ success: false, message: 'Failed to update' });
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

const getQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(400).json({ success: false, message: 'Question not found' });
        }

        const resp = {
            success: true,
            data: question,
        };
        return res.json(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};


const getAllQuestions = async (req, res, next) => {
    try {
        // Assuming you have a model named Question that represents your questions
        const questions = await Question.find();
        const resp = {
            success: true,
            data: questions,
        };
        res.status(200).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

module.exports = { createQuestion, getQuestion, updateAQuestion, getAllQuestions };
