const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        // Auth fields
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        googleId: {
            type: String,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        photoUrl: String,

        // Onboarding fields
        dob: Date,
        relationshipStatus: {
            type: String,
            enum: ['dating', 'engaged', 'married', 'other']
        },
        livingStyle: {
            type: String,
            enum: ['long_distance', 'same_city', 'living_together']
        },
        anniversary: Date,
        partnerName: String, // Temporary storage until paired

        // Pairing fields
        coupleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Couple'
        },

        // App tracking
        isOnboardingComplete: {
            type: Boolean,
            default: false
        },
        lastActive: Date,
        pushToken: String,
        platform: {
            type: String,
            enum: ['ios', 'android']
        }
    },
    {
        timestamps: true
    }
);

// Indexes
userSchema.index({ coupleId: 1 });

module.exports = mongoose.model('User', userSchema);
