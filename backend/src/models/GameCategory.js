const mongoose = require('mongoose');

const gameCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
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

// ------------------------------------------------------------------
// Indexes
// ------------------------------------------------------------------
gameCategorySchema.index({ name: 1 });
gameCategorySchema.index({ isActive: 1 });

module.exports = mongoose.model('GameCategory', gameCategorySchema);
