const Message = require('../models/Message');
const Couple = require('../models/Couple');
const { successResponse, errorResponse } = require('@closeus/utils');

/**
 * Send message (HTTP fallback)
 */
exports.sendMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, content, metadata } = req.body;

        // Get user's couple
        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true,
            isPaired: true
        });

        if (!couple) {
            return res.status(404).json(errorResponse('You are not part of a paired couple', 404));
        }

        // Create message
        const message = await Message.create({
            coupleId: couple._id,
            senderId: userId,
            type: type || 'text',
            content,
            metadata: metadata || {}
        });

        res.json(successResponse({ message }, 'Message sent'));
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Get message history
 */
exports.getMessages = async (req, res) => {
    try {
        const userId = req.userId;
        const { limit = 50, before } = req.query;

        // Get user's couple
        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true
        });

        if (!couple) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        // Build query
        const query = { coupleId: couple._id };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate('senderId', 'name');

        res.json(successResponse({ messages }, 'Messages retrieved'));
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Mark message as read
 */
exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findByIdAndUpdate(
            messageId,
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json(errorResponse('Message not found', 404));
        }

        res.json(successResponse({ message }, 'Message marked as read'));
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};
