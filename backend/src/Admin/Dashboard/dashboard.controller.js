const User = require('../../models/User');
const Couple = require('../../models/Couple');
const Message = require('../../models/Message');
const Question = require('../../models/Question');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// ------------------------------------------------------------------
// Get Dashboard Stats
// ------------------------------------------------------------------
const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalCouples, pairedCouples, totalMessages, totalQuestions] =
            await Promise.all([
                User.countDocuments(),
                Couple.countDocuments(),
                Couple.countDocuments({ isPaired: true }),
                Message.countDocuments(),
                Question.countDocuments(),
            ]);

        // ------------------------------------------------------------------
        // Recent Signups (Last 7 Days)
        // ------------------------------------------------------------------
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentSignups = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
        });

        // ------------------------------------------------------------------
        // Active Couples (Last 7 Days)
        // ------------------------------------------------------------------
        const activeCouples = await Message.distinct('coupleId', {
            createdAt: { $gte: sevenDaysAgo },
        });

        res.json(
            successResponse({
                users: {
                    total: totalUsers,
                    recent: recentSignups,
                },
                couples: {
                    total: totalCouples,
                    paired: pairedCouples,
                    unpaired: totalCouples - pairedCouples,
                    active: activeCouples.length,
                },
                messages: {
                    total: totalMessages,
                },
                questions: {
                    total: totalQuestions,
                },
            })
        );
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get All Users
// ------------------------------------------------------------------
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('coupleId', 'coupleTag isPaired');

        const total = await User.countDocuments(query);

        res.json(
            successResponse({
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit)),
                },
            })
        );
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get All Couples
// ------------------------------------------------------------------
const getCouples = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const couples = await Couple.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('partner1Id partner2Id', 'name email');

        const total = await Couple.countDocuments();

        res.json(
            successResponse({
                couples,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit)),
                },
            })
        );
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    getDashboardStats,
    getUsers,
    getCouples,
};
