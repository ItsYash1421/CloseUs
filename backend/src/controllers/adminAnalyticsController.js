const User = require('../models/User');
const Couple = require('../models/Couple');
const Message = require('../models/Message');
const Question = require('../models/Question');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const { successResponse, errorResponse } = require('../utils');

// Get enhanced dashboard statistics
exports.getEnhancedStats = async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Basic stats
        const totalUsers = await User.countDocuments();
        const totalCouples = await Couple.countDocuments({ isPaired: true });
        const activeCouples = await Couple.countDocuments({
            isPaired: true,
            updatedAt: { $gte: weekAgo }
        });

        // Today's stats
        const todaySignups = await User.countDocuments({ createdAt: { $gte: today } });
        const todayMessages = await Message.countDocuments({ createdAt: { $gte: today } });

        // Weekly growth
        const lastWeekUsers = await User.countDocuments({ createdAt: { $gte: weekAgo } });
        const previousWeekStart = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
        const previousWeekUsers = await User.countDocuments({
            createdAt: { $gte: previousWeekStart, $lt: weekAgo }
        });

        const weeklyGrowth = previousWeekUsers > 0
            ? ((lastWeekUsers - previousWeekUsers) / previousWeekUsers * 100).toFixed(1)
            : 100;

        // Active users (users with events in last 24 hours)
        const activeNow = await AnalyticsEvent.distinct('userId', {
            timestamp: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
        });

        res.json(successResponse({
            overview: {
                totalUsers,
                totalCouples,
                activeCouples,
                totalMessages: await Message.countDocuments(),
                totalQuestions: await Question.countDocuments(),
            },
            today: {
                signups: todaySignups,
                messages: todayMessages,
                activeUsers: activeNow.length,
            },
            growth: {
                weekly: {
                    newUsers: lastWeekUsers,
                    growthPercent: weeklyGrowth,
                },
            },
        }));
    } catch (error) {
        console.error('Error fetching enhanced stats:', error);
        res.status(500).json(errorResponse('Failed to fetch statistics'));
    }
};

// Get user analytics
exports.getUserAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;

        const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        // User growth over time
        const userGrowth = await User.aggregate([
            {
                $match: { createdAt: { $gte: startDate } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Retention rate (users who returned after 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUsers = await User.find({
            createdAt: { $lte: sevenDaysAgo, $gte: startDate }
        });

        const returnedUsers = await AnalyticsEvent.distinct('userId', {
            userId: { $in: newUsers.map(u => u._id) },
            timestamp: { $gte: sevenDaysAgo }
        });

        const retentionRate = newUsers.length > 0
            ? (returnedUsers.length / newUsers.length * 100).toFixed(2)
            : 0;

        res.json(successResponse({
            userGrowth,
            retentionRate,
            totalUsers: await User.countDocuments(),
        }));
    } catch (error) {
        console.error('Error fetching user analytics:', error);
        res.status(500).json(errorResponse('Failed to fetch user analytics'));
    }
};

// Get engagement analytics
exports.getEngagementAnalytics = async (req, res) => {
    try {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // DAU (Daily Active Users)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dau = await AnalyticsEvent.distinct('userId', {
            timestamp: { $gte: today }
        });

        // Event breakdown
        const eventBreakdown = await AnalyticsEvent.aggregate([
            {
                $match: { timestamp: { $gte: weekAgo } }
            },
            {
                $group: {
                    _id: '$eventType',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Average session duration
        const sessions = await AnalyticsEvent.aggregate([
            {
                $match: { timestamp: { $gte: weekAgo } }
            },
            {
                $group: {
                    _id: '$sessionId',
                    start: { $min: '$timestamp' },
                    end: { $max: '$timestamp' }
                }
            },
            {
                $project: {
                    duration: {
                        $divide: [
                            { $subtract: ['$end', '$start'] },
                            1000 * 60 // Convert to minutes
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgDuration: { $avg: '$duration' }
                }
            }
        ]);

        const avgSessionDuration = sessions.length > 0 ? sessions[0].avgDuration.toFixed(1) : 0;

        res.json(successResponse({
            dau: dau.length,
            eventBreakdown,
            avgSessionDuration: `${avgSessionDuration} min`,
        }));
    } catch (error) {
        console.error('Error fetching engagement analytics:', error);
        res.status(500).json(errorResponse('Failed to fetch engagement analytics'));
    }
};

// Track analytics event (from mobile app)
exports.trackEvent = async (req, res) => {
    try {
        const { eventType, eventData, sessionId, deviceInfo } = req.body;

        const event = new AnalyticsEvent({
            userId: req.userId,
            eventType,
            eventData,
            sessionId,
            deviceInfo,
        });

        await event.save();

        res.json(successResponse(null, 'Event tracked'));
    } catch (error) {
        console.error('Error tracking event:', error);
        res.status(500).json(errorResponse('Failed to track event'));
    }
};
