
const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: null,
    },
    coins:{
        type:Number,
        default:0,
    }
});

const CoinModel = mongoose.model('Coins', CoinSchema);
module.exports = CoinModel;
