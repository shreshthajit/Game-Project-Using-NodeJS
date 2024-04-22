const express = require('express');
const router = express.Router();

const challengeController = require('../../controllers/challenge/index');
const searchController = require('../../controllers/search/index');
const { interviewerAuthentication, userAuthentication, adminAuthentication } = require('../../middlewares/authenticate');

router.get('/interviewees', interviewerAuthentication, searchController.getInterviewees);
router.get('/users', userAuthentication, searchController.getAllUsersWithPagination);
router.get('/admin/users', adminAuthentication, searchController.getAllUsersWithPagination);
router.get('/languages', userAuthentication, challengeController.getLanguages);

module.exports = router;