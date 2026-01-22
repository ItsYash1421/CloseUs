const mongoose = require('mongoose');

const dailyCoupleQuestionSchema = new mongoose.Schema(
    {
        coupleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Couple',
            required: true,
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
        },
        date: {
            type: Date, // Normalized to YYYY-MM-DD
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// ------------------------------------------------------------------
// Ensure One Question Per Couple Per Day
// ------------------------------------------------------------------
dailyCoupleQuestionSchema.index({ coupleId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyCoupleQuestion', dailyCoupleQuestionSchema);
