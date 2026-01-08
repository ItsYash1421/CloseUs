const Notification = require('../models/Notification');
const NotificationTemplate = require('../models/NotificationTemplate');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils');
const { sendBulkNotifications, sendPushNotification } = require('../services/notificationService');

// ========== NOTIFICATION TEMPLATES ==========

// Get all notification templates
exports.getAllTemplates = async (req, res) => {
    try {
        const { type, isActive } = req.query;
        const filter = {};

        if (type) filter.type = type;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const templates = await NotificationTemplate.find(filter)
            .sort({ createdAt: -1 });

        res.json(successResponse(templates));
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json(errorResponse('Failed to fetch templates'));
    }
};

// Create new notification template
exports.createTemplate = async (req, res) => {
    try {
        const { title, body, type, targetScreen, emoji, scheduledFor, metadata } = req.body;

        const template = await NotificationTemplate.create({
            title,
            body,
            type,
            targetScreen,
            emoji,
            scheduledFor,
            metadata,
            createdBy: req.user?.email || 'admin',
        });

        res.status(201).json(successResponse(template, 'Template created successfully'));
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json(errorResponse('Failed to create template'));
    }
};

// Update notification template
exports.updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const template = await NotificationTemplate.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!template) {
            return res.status(404).json(errorResponse('Template not found', 404));
        }

        res.json(successResponse(template, 'Template updated successfully'));
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json(errorResponse('Failed to update template'));
    }
};

// Delete notification template
exports.deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;

        const template = await NotificationTemplate.findByIdAndDelete(id);

        if (!template) {
            return res.status(404).json(errorResponse('Template not found', 404));
        }

        res.json(successResponse(null, 'Template deleted successfully'));
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json(errorResponse('Failed to delete template'));
    }
};

// Activate/Deactivate template
exports.toggleTemplateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const template = await NotificationTemplate.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!template) {
            return res.status(404).json(errorResponse('Template not found', 404));
        }

        res.json(successResponse(
            template,
            `Template ${isActive ? 'activated' : 'deactivated'} successfully`
        ));
    } catch (error) {
        console.error('Error toggling template status:', error);
        res.status(500).json(errorResponse('Failed to update template status'));
    }
};

// ========== SEND NOTIFICATIONS ==========

// Send notification to all users
exports.sendToAllUsers = async (req, res) => {
    try {
        const { templateId, customTitle, customBody, targetScreen } = req.body;

        let title, body, screen, type;

        if (templateId) {
            const template = await NotificationTemplate.findById(templateId);
            if (!template || !template.isActive) {
                return res.status(400).json(errorResponse('Template not found or inactive'));
            }
            title = template.title;
            body = template.body;
            screen = template.targetScreen;
            type = template.type;

            // Increment sent count
            template.sentCount += 1;
            await template.save();
        } else {
            title = customTitle;
            body = customBody;
            screen = targetScreen || 'Home';
            type = 'custom';
        }

        // Get all users with push tokens
        const users = await User.find({
            pushToken: { $exists: true, $ne: null },
        }).select('pushToken');

        if (users.length === 0) {
            return res.json(successResponse({
                sentCount: 0,
                message: 'No users with push tokens found',
            }));
        }

        // Prepare notifications
        const notifications = users.map(user => ({
            token: user.pushToken,
            title,
            body,
            data: {
                type,
                screen,
                timestamp: Date.now().toString(),
            },
        }));

        // Send in batches
        const results = await sendBulkNotifications(notifications);

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failureCount = results.filter(r => r.status === 'rejected').length;

        res.json(successResponse({
            sentCount: successCount,
            failedCount: failureCount,
            totalUsers: users.length,
        }, 'Notifications sent successfully'));
    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).json(errorResponse('Failed to send notifications'));
    }
};

// Send notification to specific users
exports.sendToSpecificUsers = async (req, res) => {
    try {
        const { userIds, templateId, customTitle, customBody, targetScreen } = req.body;

        let title, body, screen, type;

        if (templateId) {
            const template = await NotificationTemplate.findById(templateId);
            if (!template || !template.isActive) {
                return res.status(400).json(errorResponse('Template not found or inactive'));
            }
            title = template.title;
            body = template.body;
            screen = template.targetScreen;
            type = template.type;

            template.sentCount += userIds.length;
            await template.save();
        } else {
            title = customTitle;
            body = customBody;
            screen = targetScreen || 'Home';
            type = 'custom';
        }

        // Get specified users with push tokens
        const users = await User.find({
            _id: { $in: userIds },
            pushToken: { $exists: true, $ne: null },
        }).select('pushToken');

        if (users.length === 0) {
            return res.json(successResponse({
                sentCount: 0,
                message: 'No users with push tokens found',
            }));
        }

        const notifications = users.map(user => ({
            token: user.pushToken,
            title,
            body,
            data: {
                type,
                screen,
            },
        }));

        const results = await sendBulkNotifications(notifications);

        const successCount = results.filter(r => r.status === 'fulfilled').length;

        res.json(successResponse({
            sentCount: successCount,
            totalUsers: users.length,
        }, 'Notifications sent successfully'));
    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).json(errorResponse('Failed to send notifications'));
    }
};

// ========== NOTIFICATION STATS ==========

// Get notification stats
exports.getNotificationStats = async (req, res) => {
    try {
        const totalTemplates = await NotificationTemplate.countDocuments();
        const activeTemplates = await NotificationTemplate.countDocuments({ isActive: true });
        const totalSent = await NotificationTemplate.aggregate([
            { $group: { _id: null, total: { $sum: '$sentCount' } } },
        ]);

        const usersWithTokens = await User.countDocuments({
            pushToken: { $exists: true, $ne: null },
        });

        const totalUsers = await User.countDocuments();

        res.json(successResponse({
            totalTemplates,
            activeTemplates,
            inactiveTemplates: totalTemplates - activeTemplates,
            totalNotificationsSent: totalSent[0]?.total || 0,
            usersWithPushTokens: usersWithTokens,
            totalUsers,
            tokenCoverage: totalUsers > 0 ? ((usersWithTokens / totalUsers) * 100).toFixed(2) : 0,
        }));
    } catch (error) {
        console.error('Error fetching notification stats:', error);
        res.status(500).json(errorResponse('Failed to fetch stats'));
    }
};

// ========== LEGACY NOTIFICATION SYSTEM (Keep for backward compatibility) ==========

// Create notification
exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification({
            ...req.body,
            createdBy: req.adminId,
            status: req.body.scheduledFor ? 'scheduled' : 'scheduled',
        });

        await notification.save();

        res.status(201).json(successResponse(notification, 'Notification created'));
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json(errorResponse('Failed to create notification'));
    }
};

// Get all notifications
exports.getNotifications = async (req, res) => {
    try {
        const { status, type, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const notifications = await Notification.find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Notification.countDocuments(query);

        res.json(successResponse({
            notifications,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        }));
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json(errorResponse('Failed to fetch notifications'));
    }
};

// Send notification immediately
exports.sendNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json(errorResponse('Notification not found', 404));
        }

        // Get target users
        let targetUsers = [];
        if (notification.sendToAll) {
            targetUsers = await User.find({ pushToken: { $exists: true, $ne: null } }, 'pushToken').lean();
        } else if (notification.targetUsers.length > 0) {
            targetUsers = await User.find(
                { _id: { $in: notification.targetUsers }, pushToken: { $exists: true, $ne: null } },
                'pushToken'
            ).lean();
        }

        // Send via FCM
        const notifications = targetUsers.map(user => ({
            token: user.pushToken,
            title: notification.title,
            body: notification.body,
            data: {
                type: notification.type,
                screen: 'Home',
            },
        }));

        const results = await sendBulkNotifications(notifications);
        const successCount = results.filter(r => r.status === 'fulfilled').length;

        notification.metrics.sent = successCount;
        notification.sentAt = new Date();
        notification.status = 'sent';
        await notification.save();

        res.json(successResponse(notification, 'Notification sent successfully'));
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json(errorResponse('Failed to send notification'));
    }
};

// Get notification metrics
exports.getNotificationMetrics = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json(errorResponse('Notification not found', 404));
        }

        const metrics = {
            sent: notification.metrics.sent,
            delivered: notification.metrics.delivered,
            opened: notification.metrics.opened,
            clicked: notification.metrics.clicked,
            deliveryRate: notification.metrics.sent > 0
                ? (notification.metrics.delivered / notification.metrics.sent * 100).toFixed(2)
                : 0,
            openRate: notification.metrics.delivered > 0
                ? (notification.metrics.opened / notification.metrics.delivered * 100).toFixed(2)
                : 0,
            clickRate: notification.metrics.opened > 0
                ? (notification.metrics.clicked / notification.metrics.opened * 100).toFixed(2)
                : 0,
        };

        res.json(successResponse(metrics));
    } catch (error) {
        console.error('Error fetching notification metrics:', error);
        res.status(500).json(errorResponse('Failed to fetch metrics'));
    }
};

