const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        date: {
            type: Date, // Normalized to YYYY-MM-DD
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure one answer per user per question
answerSchema.index({ userId: 1, questionId: 1 }, { unique: true });
answerSchema.index({ coupleId: 1, date: 1 });

module.exports = mongoose.model('Answer', answerSchema);
