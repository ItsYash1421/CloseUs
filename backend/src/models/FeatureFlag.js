const mongoose = require('mongoose');

const featureFlagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        isEnabled: {
            type: Boolean,
            default: false,
        },
        rolloutPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        targetGroups: [
            {
                type: String,
                enum: ['beta_users', 'premium', 'all', 'new_users', 'active_couples'],
            },
        ],
        enabledAt: {
            type: Date,
        },
        disabledAt: {
            type: Date,
        },
        usageMetrics: {
            totalUsers: {
                type: Number,
                default: 0,
            },
            activeUsers: {
                type: Number,
                default: 0,
            },
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
// Check if Feature is Enabled for User
// ------------------------------------------------------------------
featureFlagSchema.methods.isEnabledForUser = function (user) {
    if (!this.isEnabled) return false;

    // Check rollout percentage
    if (this.rolloutPercentage < 100) {
        const userHash = parseInt(user._id.toString().slice(-8), 16);
        const threshold = (this.rolloutPercentage / 100) * 0xffffffff;
        if (userHash > threshold) return false;
    }

    // Check target groups
    if (this.targetGroups.length > 0) {
        // Add logic here based on user properties
        return this.targetGroups.includes('all');
    }

    return true;
};

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);
