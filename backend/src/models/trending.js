
const mongoose = require('mongoose');

const TrendingSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
    },
    topicUsed: {
        type: Number,
        default: 0,
    }
}, {
    versionKey: false,
});

const TrendingModel = mongoose.model('trending', TrendingSchema);
module.exports = TrendingModel;
