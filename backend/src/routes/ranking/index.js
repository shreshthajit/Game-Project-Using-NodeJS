const express = require('express');
const router = express.Router();

const rankingController = require('../../controllers/ranking/index');
const { userAuthentication } = require('../../middlewares/authenticate');

router.get('/players/top-three', userAuthentication, rankingController.getTopThreePlayer);
router.get('/players', userAuthentication, rankingController.getAllPlayer);

module.exports = router;