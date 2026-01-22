const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        body: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['campaign', 'system', 'personal', 'announcement'],
            default: 'system',
        },
        priority: {
            type: String,
            enum: ['high', 'medium', 'low'],
            default: 'medium',
        },
        targetUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        sendToAll: {
            type: Boolean,
            default: false,
        },
        scheduledFor: {
            type: Date,
        },
        sentAt: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['scheduled', 'sending', 'sent', 'failed'],
            default: 'scheduled',
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
        },
        imageUrl: String,
        deepLink: String,
        metrics: {
            sent: {
                type: Number,
                default: 0,
            },
            delivered: {
                type: Number,
                default: 0,
            },
            opened: {
                type: Number,
                default: 0,
            },
            clicked: {
                type: Number,
                default: 0,
            },
        },
        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Campaign',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// ------------------------------------------------------------------
// Index for Scheduled Notifications
// ------------------------------------------------------------------
notificationSchema.index({ scheduledFor: 1, status: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
