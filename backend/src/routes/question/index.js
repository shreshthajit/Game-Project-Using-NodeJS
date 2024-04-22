
const express = require('express');
const router = express.Router();

const questionController = require('../../controllers/question/index');
const { adminAuthentication } = require('../../middlewares/authenticate');

router.post('/question', adminAuthentication, questionController.createQuestion);
router.get('/questions/:id', adminAuthentication, questionController.getQuestion);
router.get('/questions', adminAuthentication, questionController.getAllQuestions);
router.patch('/question/:id', adminAuthentication, questionController.updateAQuestion);

module.exports = router;