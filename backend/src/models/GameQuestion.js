const mongoose = require('mongoose');

const gameQuestionSchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GameCategory',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        timesPlayed: {
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
gameQuestionSchema.index({ categoryId: 1 });

module.exports = mongoose.model('GameQuestion', gameQuestionSchema);
