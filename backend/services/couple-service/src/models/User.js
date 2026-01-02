const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: String,
        name: String,
        dob: Date,
        googleId: String,
        relationshipStatus: String,
        partnerName: String,
        livingStyle: String,
        anniversary: Date,
        coupleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Couple'
        },
        profileComplete: Boolean,
        isOnboarded: Boolean
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
