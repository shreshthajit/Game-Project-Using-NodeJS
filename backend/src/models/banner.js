
const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    url: {
        type: String,
        default: null,
    },
    showOnHomePage: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,
    versionKey: false,
});

const BannerModel = mongoose.model('Banner', BannerSchema);
module.exports = BannerModel;
