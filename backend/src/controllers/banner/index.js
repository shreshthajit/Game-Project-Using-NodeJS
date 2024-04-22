const Banner = require("../../models/banner");
const { randomImageName, getPresignedUrl, uploadImage } = require("../../utils/s3");
const { createBannerValidation, updateBannerValidation } = require("../../validations/banner");

const createBanner = async (req, res) => {
    try {
        const validation = createBannerValidation(req.body);
        if (validation.error || !req.file) {
            return res.status(422).json({ success: false, message: !req.file ? 'Please upload a banner image' : validation.error.details[0].message });
        }

        let image = null;
        if (req.file) {
            image = randomImageName() + req.file.originalname;
            const uploadRes = await uploadImage(image, req.file);
            if (!uploadRes) {
                return res.status(400).json({ success: false, message: 'Failed to upload banner image' });
            }
        }

        const result = await Banner.create({
            ...req.body,
            ...(image && { image })
        });
        if (!result) {
            return res.status(400).json({ success: false, message: 'Failed to add a banner' });
        }
        const resp = {
            success: true,
            data: result,
        };
        res.status(201).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const validation = updateBannerValidation(req.body);
        if (validation.error || !id) {
            return res.status(422).json({ success: false, message: !id ? 'Provide a valid question id' : validation.error.details[0].message });
        }

        let image = null;
        if (req.file) {
            image = randomImageName() + req.file.originalname;
            const uploadRes = await uploadImage(image, req.file);
            if (!uploadRes) {
                return res.status(400).json({ success: false, message: 'Failed to upload banner image' });
            }
        }

        const result = await Banner.findOneAndUpdate({ _id: id }, {
            ...req.body,
            ...(image && { image })
        }, { new: true });
        if (!result) {
            return res.status(400).json({ success: false, message: 'Failed to update' });
        }
        if (result.image) {
            result.image = await getPresignedUrl(result.image);
        }
        const resp = {
            success: true,
            data: result,
        };
        res.status(201).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Banner.findOneAndDelete({ _id: id });
        if (!result) {
            return res.status(400).json({ success: false, message: 'Failed to delete a banner' });
        }
        const resp = {
            success: true,
            data: {
                message: 'Successfully deleted a banner',
            },
        };
        res.status(201).send(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({});
        for await (const banner of banners) {
            if (banner.image) {
                banner.image = await getPresignedUrl(banner.image);
            }
        }
        const resp = {
            success: true,
            data: banners,
        };
        return res.json(resp);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
    }
};

module.exports = { createBanner, getBanners, updateBanner, deleteBanner, };
