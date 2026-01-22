const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        // ------------------------------------------------------------------
        // Auth Fields
        // ------------------------------------------------------------------
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        googleId: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        photoUrl: String,
        isDefaultAvatar: {
            type: Boolean,
            default: false,
        },

        gender: {
            type: String,
            enum: ['male', 'female'],
        },
        dob: Date,
        relationshipStatus: {
            type: String,
            enum: ['dating', 'engaged', 'married', 'other'],
        },
        livingStyle: {
            type: String,
            enum: ['long_distance', 'same_city', 'living_together'],
        },
        anniversary: Date,
        partnerName: String, // Temporary storage until paired

        // ------------------------------------------------------------------
        // Pairing Fields
        // ------------------------------------------------------------------
        coupleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Couple',
        },

        // ------------------------------------------------------------------
        // App Tracking
        // ------------------------------------------------------------------
        isOnboardingComplete: {
            type: Boolean,
            default: false,
        },
        lastActive: Date,
        pushToken: String,
        platform: {
            type: String,
            enum: ['ios', 'android'],
        },

        // ------------------------------------------------------------------
        // Notification Preferences
        // ------------------------------------------------------------------
        notificationPreferences: {
            pushEnabled: {
                type: Boolean,
                default: true,
            },
            dailyReminders: {
                type: Boolean,
                default: true,
            },
            partnerActivity: {
                type: Boolean,
                default: true,
            },
            messages: {
                type: Boolean,
                default: true,
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ------------------------------------------------------------------
// Virtual Field: isOnline
// ------------------------------------------------------------------
userSchema.virtual('isOnline').get(function () {
    if (!this.lastActive) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.lastActive > fiveMinutesAgo;
});

// ------------------------------------------------------------------
// Indexes
// ------------------------------------------------------------------
userSchema.index({ coupleId: 1 });

module.exports = mongoose.model('User', userSchema);
