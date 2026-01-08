const mongoose = require('mongoose');

const questionCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: String,
        emoji: String,
        color: String,
        isActive: {
            type: Boolean,
            default: true,
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

module.exports = mongoose.model('QuestionCategory', questionCategorySchema);
