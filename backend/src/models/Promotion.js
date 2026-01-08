const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        enum: ['feature_unlock', 'discount', 'special_access', 'premium_trial'],
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        default: null, // null = unlimited
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    applicableTo: [{
        type: String,
    }],
    usedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        usedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
}, {
    timestamps: true,
});

// Index for active promotions
promotionSchema.index({ code: 1, isActive: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Promotion', promotionSchema);
