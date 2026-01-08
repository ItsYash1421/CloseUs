const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['never_have_i_ever', 'would_you_rather', 'who_more_likely'],
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: String,
        emoji: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        comingSoon: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Game', gameSchema);
