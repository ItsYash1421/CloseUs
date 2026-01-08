const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: ['promotion', 'event', 'feature_launch', 'announcement'],
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'completed'],
        default: 'draft',
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    targetAudience: {
        allUsers: {
            type: Boolean,
            default: false,
        },
        coupleStatus: {
            type: String,
            enum: ['all', 'paired', 'unpaired'],
            default: 'all',
        },
        minDaysTogether: {
            type: Number,
            default: 0,
        },
        regions: [String],
    },
    content: {
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        imageUrl: String,
        ctaText: String,
        ctaLink: String,
    },
    metrics: {
        sent: {
            type: Number,
            default: 0,
        },
        viewed: {
            type: Number,
            default: 0,
        },
        clicked: {
            type: Number,
            default: 0,
        },
        converted: {
            type: Number,
            default: 0,
        },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
}, {
    timestamps: true,
});

// Index for querying active campaigns
campaignSchema.index({ status: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Campaign', campaignSchema);
