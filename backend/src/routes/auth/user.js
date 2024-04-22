/*
  Express Router Configuration for User Authentication Routes.

  - Defines routes for user signup, login, and checking authentication status.
  - Routes are handled by the corresponding controller methods.

  @module Router
*/

const express = require('express');
const router = express.Router();

// Import user authentication controller
const authController = require('../../controllers/auth/user');

// Define routes and associate with controller methods
router.post('/signup-send-otp', authController.sendOTP);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google', authController.googleSignIn);
// router.get('/check-auth', authController.checkAuth);

// Additional routes (commented out for now)
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Export the user authentication router
module.exports = router;
