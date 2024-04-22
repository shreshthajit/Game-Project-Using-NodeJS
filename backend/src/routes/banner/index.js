const express = require('express');
const router = express.Router();

const bannerController = require('../../controllers/banner/index');
const { adminAuthentication } = require('../../middlewares/authenticate');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/banner', adminAuthentication, upload.single('image'), bannerController.createBanner);
router.get('/banners', bannerController.getBanners);
router.patch('/banners/:id', adminAuthentication, upload.single('image'), bannerController.updateBanner);
router.delete('/banners/:id', adminAuthentication, bannerController.deleteBanner);

module.exports = router;
