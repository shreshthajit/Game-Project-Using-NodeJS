/*
  Express Router Configuration for Admin Authentication Routes.

  - Defines routes for Admin signup, login, and checking authentication status.
  - Routes are handled by the corresponding controller methods.

  @module Router
*/

const express = require('express');
const router = express.Router();

// Import Admin authentication controller
const authController = require('../../controllers/auth/admin');

// Define routes and associate with controller methods
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/check-auth', authController.checkAuth);

// Export the Admin authentication router
module.exports = router;
