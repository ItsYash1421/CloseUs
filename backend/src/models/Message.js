const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        coupleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Couple',
            required: true,
            index: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['text', 'image', 'voice', 'gif'],
            default: 'text'
        },
        content: {
            type: String,
            required: true
        },
        metadata: {
            duration: Number, // For voice messages
            size: Number,
            mimeType: String,
            thumbnailUrl: String
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Indexes
messageSchema.index({ coupleId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

module.exports = mongoose.model('Message', messageSchema);
