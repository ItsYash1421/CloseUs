const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    eventType: {
        type: String,
        required: true,
        enum: [
            'screen_view',
            'question_answered',
            'game_played',
            'message_sent',
            'profile_updated',
            'couple_paired',
            'campaign_viewed',
            'campaign_clicked',
            'notification_opened',
            'feature_used',
            'app_opened',
            'app_closed',
        ],
    },
    eventData: {
        type: mongoose.Schema.Types.Mixed,
    },
    sessionId: {
        type: String,
        required: true,
    },
    deviceInfo: {
        platform: {
            type: String,
            enum: ['ios', 'android', 'web'],
        },
        version: String,
        deviceModel: String,
        osVersion: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
}, {
    timestamps: true,
});

// Indexes for analytics queries
analyticsEventSchema.index({ userId: 1, timestamp: -1 });
analyticsEventSchema.index({ eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ timestamp: -1 });
analyticsEventSchema.index({ sessionId: 1 });

// TTL index - remove events older than 90 days
analyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
