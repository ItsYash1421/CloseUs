const mongoose = require('mongoose');

const coupleSchema = new mongoose.Schema({
    partner1Id: mongoose.Schema.Types.ObjectId,
    partner2Id: mongoose.Schema.Types.ObjectId,
    isPaired: Boolean,
    isActive: Boolean
});

module.exports = mongoose.model('Couple', coupleSchema);
