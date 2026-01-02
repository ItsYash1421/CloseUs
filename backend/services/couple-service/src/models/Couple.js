const mongoose = require('mongoose');

const coupleSchema = new mongoose.Schema(
    {
        partner1Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        partner2Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false // Will be set when second partner pairs
        },
        coupleTag: {
            type: String,
            required: false // Generated after pairing
        },
        pairingKey: {
            type: String,
            required: true,
            unique: true,
            uppercase: true
        },
        isPaired: {
            type: Boolean,
            default: false
        },
        anniversary: {
            type: Date,
            required: false
        },
        livingStyle: {
            type: String,
            enum: ['long_distance', 'same_city', 'living_together'],
            required: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        pairedAt: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true
    }
);

// Indexes
coupleSchema.index({ pairingKey: 1 });
coupleSchema.index({ partner1Id: 1 });
coupleSchema.index({ partner2Id: 1 });
coupleSchema.index({ isPaired: 1 });

module.exports = mongoose.model('Couple', coupleSchema);
