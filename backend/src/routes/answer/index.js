const express = require('express');
const router = express.Router();

const answerController = require('../../controllers/answer/index');
const { userAuthentication } = require('../../middlewares/authenticate');

router.post('/check-answer', userAuthentication, answerController.checkAnswer);
router.post('/submit-answer', userAuthentication, answerController.submitAnswer);
router.post('/deduct-score', userAuthentication, answerController.deductScore);
router.post('/submit-self-challenge-answer', userAuthentication, answerController.selfChallengeAnswer);
router.get('/check-challenge-expiry/:challengeId', userAuthentication, answerController.challengeExpiry);

module.exports = router;