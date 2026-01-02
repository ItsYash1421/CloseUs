const Couple = require('../models/Couple');
const User = require('../models/User');
const {
    generatePairingKey,
    generateCoupleTag,
    calculateDaysTogether,
    calculateTimeTogether,
    successResponse,
    errorResponse
} = require('@closeus/utils');

/**
 * Create pairing key
 */
exports.createPairingKey = async (req, res) => {
    try {
        const userId = req.userId;

        // Check if user already has an active couple
        const existingCouple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true
        });

        if (existingCouple) {
            return res.status(400).json(
                errorResponse('You are already part of a couple. Unpair first.', 400)
            );
        }

        // Generate unique pairing key
        let pairingKey;
        let keyExists = true;

        while (keyExists) {
            pairingKey = generatePairingKey();
            const existing = await Couple.findOne({ pairingKey });
            if (!existing) keyExists = false;
        }

        // Create couple entry
        const couple = await Couple.create({
            partner1Id: userId,
            pairingKey,
            isPaired: false
        });

        // Update user's coupleId
        await User.findByIdAndUpdate(userId, { coupleId: couple._id });

        res.json(
            successResponse(
                {
                    coupleId: couple._id,
                    pairingKey: couple.pairingKey
                },
                'Pairing key created successfully'
            )
        );
    } catch (error) {
        console.error('Create pairing key error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Pair with partner using key
 */
exports.pairWithPartner = async (req, res) => {
    try {
        const userId = req.userId;
        const { pairingKey } = req.body;

        if (!pairingKey) {
            return res.status(400).json(errorResponse('Pairing key is required', 400));
        }

        // Find couple by pairing key
        const couple = await Couple.findOne({
            pairingKey: pairingKey.toUpperCase(),
            isActive: true
        });

        if (!couple) {
            return res.status(404).json(errorResponse('Invalid pairing key', 404));
        }

        if (couple.isPaired) {
            return res.status(400).json(errorResponse('This key is already used', 400));
        }

        if (couple.partner1Id.toString() === userId) {
            return res.status(400).json(
                errorResponse('You cannot pair with yourself', 400)
            );
        }

        // Check if user already has an active couple
        const existingCouple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true,
            _id: { $ne: couple._id }
        });

        if (existingCouple) {
            return res.status(400).json(
                errorResponse('You are already part of another couple', 400)
            );
        }

        // Get both users to generate couple tag
        const user1 = await User.findById(couple.partner1Id);
        const user2 = await User.findById(userId);

        if (!user1 || !user2) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        // Generate couple tag
        const coupleTag = generateCoupleTag(user1.name, user2.name);

        // Update couple with partner2 info
        couple.partner2Id = userId;
        couple.isPaired = true;
        couple.pairedAt = new Date();
        couple.coupleTag = coupleTag;

        // Use anniversary from either user (they should have entered it)
        if (user1.anniversary) couple.anniversary = user1.anniversary;
        else if (user2.anniversary) couple.anniversary = user2.anniversary;

        if (user1.livingStyle) couple.livingStyle = user1.livingStyle;
        else if (user2.livingStyle) couple.livingStyle = user2.livingStyle;

        await couple.save();

        // Update both users' coupleId
        await User.findByIdAndUpdate(couple.partner1Id, { coupleId: couple._id });
        await User.findByIdAndUpdate(userId, { coupleId: couple._id });

        res.json(
            successResponse(
                {
                    couple: {
                        id: couple._id,
                        coupleTag: couple.coupleTag,
                        anniversary: couple.anniversary,
                        isPaired: couple.isPaired,
                        pairedAt: couple.pairedAt,
                        partner1: {
                            id: user1._id,
                            name: user1.name
                        },
                        partner2: {
                            id: user2._id,
                            name: user2.name
                        }
                    }
                },
                'Successfully paired with partner!'
            )
        );
    } catch (error) {
        console.error('Pair with partner error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Get current couple info
 */
exports.getCoupleInfo = async (req, res) => {
    try {
        const userId = req.userId;

        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true
        })
            .populate('partner1Id', 'name email')
            .populate('partner2Id', 'name email');

        if (!couple) {
            return res.status(404).json(errorResponse('You are not part of any couple', 404));
        }

        // Calculate time together
        let timeTogether = null;
        let daysTogether = null;

        if (couple.anniversary) {
            timeTogether = calculateTimeTogether(couple.anniversary);
            daysTogether = calculateDaysTogether(couple.anniversary);
        }

        res.json(
            successResponse(
                {
                    couple: {
                        id: couple._id,
                        coupleTag: couple.coupleTag,
                        anniversary: couple.anniversary,
                        livingStyle: couple.livingStyle,
                        isPaired: couple.isPaired,
                        pairedAt: couple.pairedAt,
                        timeTogether,
                        daysTogether,
                        partner1: couple.partner1Id,
                        partner2: couple.partner2Id
                    }
                },
                'Couple info retrieved successfully'
            )
        );
    } catch (error) {
        console.error('Get couple info error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Update couple info
 */
exports.updateCouple = async (req, res) => {
    try {
        const userId = req.userId;
        const { anniversary, livingStyle } = req.body;

        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true
        });

        if (!couple) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        const updateData = {};
        if (anniversary) updateData.anniversary = new Date(anniversary);
        if (livingStyle) updateData.livingStyle = livingStyle;

        const updatedCouple = await Couple.findByIdAndUpdate(
            couple._id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .populate('partner1Id', 'name email')
            .populate('partner2Id', 'name email');

        res.json(successResponse({ couple: updatedCouple }, 'Couple updated successfully'));
    } catch (error) {
        console.error('Update couple error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Get couple statistics
 */
exports.getCoupleStats = async (req, res) => {
    try {
        const userId = req.userId;

        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true
        });

        if (!couple) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        if (!couple.anniversary) {
            return res.status(400).json(errorResponse('Anniversary date not set', 400));
        }

        const timeTogether = calculateTimeTogether(couple.anniversary);
        const daysTogether = calculateDaysTogether(couple.anniversary);
        const hoursTogether = daysTogether * 24;
        const sunrises = daysTogether;

        res.json(
            successResponse(
                {
                    stats: {
                        years: timeTogether.years,
                        months: timeTogether.months,
                        days: timeTogether.days,
                        totalDays: daysTogether,
                        hours: hoursTogether,
                        sunrises
                    }
                },
                'Stats retrieved successfully'
            )
        );
    } catch (error) {
        console.error('Get couple stats error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};
