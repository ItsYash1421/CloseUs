const Message = require('../../models/Message');
const Couple = require('../../models/Couple');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// ------------------------------------------------------------------
// Send Message
// ------------------------------------------------------------------
const sendMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, content, metadata } = req.body;

        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true,
            isPaired: true,
        });

        if (!couple) {
            return res.status(404).json(errorResponse('You are not part of a paired couple', 404));
        }

        const message = await Message.create({
            coupleId: couple._id,
            senderId: userId,
            type: type || 'text',
            content,
            metadata: metadata || {},
        });

        const populatedMessage = await Message.findById(message._id).populate(
            'senderId',
            'name photoUrl'
        );

        res.json(successResponse({ message: populatedMessage }, 'Message sent'));
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get Recent Messages (Latest 10 only - for initial load)
// ------------------------------------------------------------------
const getRecentMessages = async (req, res) => {
    try {
        const userId = req.userId;

        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true,
        });

        if (!couple) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        // Get only the latest 10 messages
        const messages = await Message.find({ coupleId: couple._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('senderId', 'name photoUrl gender isOnline');

        res.json(successResponse({ messages }, 'Recent messages retrieved'));
    } catch (error) {
        console.error('Get recent messages error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get Older Messages (Cursor-based pagination for infinite scroll)
// ------------------------------------------------------------------
const getOlderMessages = async (req, res) => {
    try {
        const userId = req.userId;
        const { before, limit = 20 } = req.query;

        if (!before) {
            return res.status(400).json(errorResponse('before timestamp required', 400));
        }

        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true,
        });

        if (!couple) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        // Get messages older than the 'before' timestamp
        const messages = await Message.find({
            coupleId: couple._id,
            createdAt: { $lt: new Date(before) },
        })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate('senderId', 'name photoUrl gender isOnline');

        res.json(
            successResponse(
                {
                    messages,
                    hasMore: messages.length === parseInt(limit),
                },
                'Older messages retrieved'
            )
        );
    } catch (error) {
        console.error('Get older messages error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Mark Message as Read
// ------------------------------------------------------------------
const markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;

        const message = await Message.findByIdAndUpdate(
            messageId,
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        if (!message) {
            return res.status(404).json(errorResponse('Message not found', 404));
        }

        const couple = await Couple.findById(message.coupleId);
        if (couple && couple.chatSettings && couple.chatSettings.deleteAfterSeen) {
            setTimeout(async () => {
                try {
                    await Message.deleteMany({ coupleId: message.coupleId });
                    console.log(`All messages deleted for couple ${message.coupleId} after seen`);
                } catch (err) {
                    console.error('Failed to delete messages after seen:', err);
                }
            }, 2000);
        }

        res.json(successResponse({ message }, 'Message marked as read'));
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Update Chat Settings
// ------------------------------------------------------------------
const updateChatSettings = async (req, res) => {
    try {
        const userId = req.userId;
        const { deleteAfterSeen, deleteAfter12Hours } = req.body;

        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true,
            isPaired: true,
        });

        if (!couple) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        couple.chatSettings = {
            deleteAfterSeen:
                deleteAfterSeen !== undefined
                    ? deleteAfterSeen
                    : couple.chatSettings?.deleteAfterSeen || false,
            deleteAfter12Hours:
                deleteAfter12Hours !== undefined
                    ? deleteAfter12Hours
                    : couple.chatSettings?.deleteAfter12Hours || false,
        };

        await couple.save();

        res.json(successResponse(couple.chatSettings, 'Chat settings updated'));
    } catch (error) {
        console.error('Update chat settings error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get Chat Settings
// ------------------------------------------------------------------
const getChatSettings = async (req, res) => {
    try {
        const userId = req.userId;

        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true,
        });

        if (!couple) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        const settings = couple.chatSettings || {
            deleteAfterSeen: false,
            deleteAfter12Hours: true,
        };

        res.json(successResponse(settings, 'Chat settings retrieved'));
    } catch (error) {
        console.error('Get chat settings error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Delete Message
// ------------------------------------------------------------------
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json(errorResponse('Message not found', 404));
        }

        const couple = await Couple.findOne({
            _id: message.coupleId,
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
        });

        if (!couple) {
            return res.status(403).json(errorResponse('Unauthorized', 403));
        }

        await Message.findByIdAndDelete(messageId);

        res.json(successResponse(null, 'Message deleted'));
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Delete All Messages (for Snapchat-style deletion)
// ------------------------------------------------------------------
const deleteAllMessages = async (req, res) => {
    try {
        const userId = req.userId;

        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true,
        });

        if (!couple) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        await Message.deleteMany({ coupleId: couple._id });
        res.json(successResponse(null, 'All messages deleted'));
    } catch (error) {
        console.error('Delete all messages error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    sendMessage,
    getRecentMessages,
    getOlderMessages,
    markAsRead,
    updateChatSettings,
    getChatSettings,
    deleteMessage,
    deleteAllMessages,
};
