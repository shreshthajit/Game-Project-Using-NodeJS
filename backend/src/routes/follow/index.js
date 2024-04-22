
const express = require('express');
const router = express.Router();

const followerController = require('../../controllers/follow/index');
const { userAuthentication } = require('../../middlewares/authenticate');

router.post('/follow', userAuthentication, followerController.addFollowing);
router.get('/following', userAuthentication, followerController.getFollowing);

module.exports = router;