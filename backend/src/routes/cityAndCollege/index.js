const express = require('express');
const router = express.Router();

const cityAndCollegeController = require('../../controllers/cityAndCollege/index');
const { userAuthentication } = require('../../middlewares/authenticate');

router.get('/city', userAuthentication, cityAndCollegeController.getCity);
router.get('/college', userAuthentication, cityAndCollegeController.getCollege);


module.exports = router;