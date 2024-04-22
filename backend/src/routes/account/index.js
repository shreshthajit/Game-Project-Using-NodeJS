
const express = require('express');
const router = express.Router();

const accountRoutes = require('./account');
router.use('/', accountRoutes);

module.exports = router;
