const mongoose = require('mongoose');

const gameAnswerSchema = new mongoose.Schema(
    {
        coupleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Couple',
            required: true,
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GameQuestion',
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
    },
    {
        timestamps: true,
    }
);

// ------------------------------------------------------------------
// Compound Index: One Answer Per User Per Game Question
// ------------------------------------------------------------------
gameAnswerSchema.index({ userId: 1, questionId: 1 }, { unique: true });
gameAnswerSchema.index({ coupleId: 1, questionId: 1 });

module.exports = mongoose.model('GameAnswer', gameAnswerSchema);
