const express = require('express');
const router = express.Router();

const selfChallengeController = require('../../controllers/selfChallenge/index');
const { userAuthentication } = require('../../middlewares/authenticate');

router.post('/self-challenge/create', userAuthentication, selfChallengeController.createSelfChallenge);
router.get('/self-challenges', userAuthentication, selfChallengeController.getSelfChallenges);

module.exports = router;