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
            ref: 'User'
        },

        // Pairing
        pairingKey: {
            type: String,
            unique: true,
            sparse: true 
        },
        pairingKeyExpires: Date,
        isPaired: {
            type: Boolean,
            default: false
        },

        // Relationship
        startDate: Date,
        coupleTag: {
            type: String, // e.g., #Yasushi
            unique: true,
            sparse: true
        },

        // Shared settings
        relationshipStatus: String,
        livingStyle: String,
        timeZone: String,

        // Status
        isActive: {
            type: Boolean,
            default: true
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
coupleSchema.index({ coupleTag: 1 });

module.exports = mongoose.model('Couple', coupleSchema);
