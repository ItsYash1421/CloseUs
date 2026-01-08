const mongoose = require('mongoose');

const gameCategorySchema = new mongoose.Schema(
    {
        gameType: {
            type: String,
            enum: ['never_have_i_ever', 'would_you_rather', 'who_more_likely'],
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        emoji: String,
        tags: [String],
        color: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        isTrending: {
            type: Boolean,
            default: false,
        },
        timesPlayed: {
            type: Number,
            default: 0,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

gameCategorySchema.index({ gameType: 1 });

module.exports = mongoose.model('GameCategory', gameCategorySchema);
