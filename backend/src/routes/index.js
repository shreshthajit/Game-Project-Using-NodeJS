const express = require('express');
const router = express.Router();

//Import sub-routers
const userAuthRoutes = require('./auth/user');
const userRoutes = require('./account');
const adminRoutes = require('./auth/admin');
const questionRoutes = require('./question/index');
const challengeRoutes = require('./challenge/index');
const answerRoutes = require('./answer/index');
const searchRoutes = require('./search/index');
const rankingRoutes = require('./ranking/index');
const trendingRoutes = require('./trending/index');
const bannerRoutes = require('./banner/index');
const selfChallengeRoutes = require('./selfChallenge/index');
const notificationRoutes = require('./notification/index');
const followRoutes = require('./follow/index');
const cityAndCollegeRoutes = require('./cityAndCollege/index');
// Mount sub-routers at specific paths
router.use('/user-auth', userAuthRoutes);
router.use('/account', userRoutes);
router.use('/admin-auth', adminRoutes);

router.use('/api', questionRoutes);

router.use('/api', challengeRoutes);

router.use('/api', notificationRoutes);

router.use('/api', answerRoutes);

router.use('/api', searchRoutes);

router.use('/api', followRoutes);

router.use('/api', rankingRoutes);

router.use('/api', trendingRoutes);

router.use('/api', bannerRoutes);

router.use('/api', selfChallengeRoutes);

router.use('/api', cityAndCollegeRoutes);

// Export the main router
module.exports = router;
