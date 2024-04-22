const express = require('express');
const router = express.Router();

const notificationController = require('../../controllers/notification/index');
const { userAuthentication } = require('../../middlewares/authenticate');

router.get('/notifications', userAuthentication, notificationController.getNotifications);

module.exports = router;