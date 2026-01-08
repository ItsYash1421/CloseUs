const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionCategory',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        isDaily: {
            type: Boolean,
            default: false,
        },
        dailyDate: Date,
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        timesAnswered: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

questionSchema.index({ categoryId: 1 });
questionSchema.index({ isDaily: 1, dailyDate: 1 });

module.exports = mongoose.model('Question', questionSchema);
