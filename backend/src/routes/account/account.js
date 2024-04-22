/*
  Express Router Configuration for User Account Routes.

  - Defines routes for retrieving user information, updating user account, and changing password.
  - User authentication middleware is applied to protect the routes.
  - Routes are handled by the corresponding controller methods.

  @module Router
*/

const express = require('express');
const router = express.Router();
//image uploads library
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

// Import user account controller and user authentication middleware
const userAccountController = require('../../controllers/user/account');
const { userAuthentication } = require('../../middlewares/authenticate');

// Define routes and associate with controller methods
router.get('', userAuthentication, userAccountController.me);
router.patch('', userAuthentication, upload.single('image'),  userAccountController.update);
router.patch('/change-password/send-otp', userAuthentication, userAccountController.changePasswordSendOTP);
router.patch('/change-password', userAuthentication, userAccountController.changePassword);
router.get('/coin', userAuthentication, userAccountController.getCoin);

module.exports = router;
