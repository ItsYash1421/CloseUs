const mongoose = require('mongoose');

const notificationTemplateSchema = new mongoose.Schema({
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
        enum: ['announcement', 'promotion', 'reminder', 'update', 'custom'],
        default: 'custom',
    },
    targetScreen: {
        type: String,
        default: 'Home',
    },
    emoji: {
        type: String,
        default: '📢',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    scheduledFor: {
        type: Date,
        default: null,
    },
    sentCount: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: String,
        default: 'admin',
    },
    metadata: {
        type: Map,
        of: String,
    },
}, {
    timestamps: true,
});

// Index for querying active templates
notificationTemplateSchema.index({ isActive: 1, type: 1 });

module.exports = mongoose.model('NotificationTemplate', notificationTemplateSchema);
