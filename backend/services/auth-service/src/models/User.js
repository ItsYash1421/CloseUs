const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        dob: {
            type: Date,
            required: false
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        relationshipStatus: {
            type: String,
            enum: ['dating', 'engaged', 'married', 'other'],
            required: false
        },
        partnerName: {
            type: String,
            required: false
        },
        livingStyle: {
            type: String,
            enum: ['long_distance', 'same_city', 'living_together'],
            required: false
        },
        anniversary: {
            type: Date,
            required: false
        },
        coupleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Couple',
            required: false
        },
        profileComplete: {
            type: Boolean,
            default: false
        },
        isOnboarded: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ coupleId: 1 });

module.exports = mongoose.model('User', userSchema);
