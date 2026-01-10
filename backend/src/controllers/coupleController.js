const Couple = require('../models/Couple');
const User = require('../models/User');
const {
    generatePairingKey,
    generateCoupleTag,
    calculateTimeTogether,
    successResponse,
    errorResponse
} = require('../utils');

/**
 * Create pairing key (start pairing process)
 */
const createPairingKey = async (req, res) => {
    try {
        const userId = req.userId;

        // Check if already paired or has active key
        const existingCouple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true
        });

        if (existingCouple) {
            if (existingCouple.isPaired) {
                return res.status(400).json(errorResponse('Already paired with someone', 400));
            }
            // Return existing pending couple with key
            return res.json(successResponse(existingCouple, 'Pending pairing found'));
        }

        // Generate unique key
        let pairingKey;
        let isUnique = false;
        while (!isUnique) {
            pairingKey = generatePairingKey();
            const duplicate = await Couple.findOne({ pairingKey });
            if (!duplicate) isUnique = true;
        }

        // Create couple document
        const couple = await Couple.create({
            partner1Id: userId,
            pairingKey,
            pairingKeyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });

        res.status(201).json(successResponse(couple, 'Pairing key generated'));
    } catch (error) {
        console.error('Create pairing key error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Pair with partner using key
 */
const pairWithPartner = async (req, res) => {
    try {
        const userId = req.userId;
        const { pairingKey } = req.body;

        if (!pairingKey) {
            return res.status(400).json(errorResponse('Pairing key required', 400));
        }

        // Find the couple with this key
        const couple = await Couple.findOne({
            pairingKey: pairingKey.toUpperCase(),
            isActive: true,
            isPaired: false
        });

        if (!couple) {
            return res.status(404).json(errorResponse('Invalid or expired pairing key', 404));
        }

        if (couple.partner1Id.toString() === userId) {
            return res.status(400).json(errorResponse('Cannot pair with yourself', 400));
        }

        // Get both users details to generate tag
        const partner1 = await User.findById(couple.partner1Id);
        const partner2 = await User.findById(userId);

        const coupleTag = generateCoupleTag(partner1.name, partner2.name);

        // Update couple
        couple.partner2Id = userId;
        couple.isPaired = true;
        couple.coupleTag = coupleTag;
        couple.startDate = partner1.anniversary || partner2.anniversary || new Date();
        couple.pairingKey = undefined; // Clear used key
        await couple.save();

        // Update both users
        await User.findByIdAndUpdate(partner1._id, { coupleId: couple._id });
        await User.findByIdAndUpdate(userId, { coupleId: couple._id });

        res.json(successResponse({ couple, coupleTag }, 'Successfully paired!'));
    } catch (error) {
        console.error('Pairing error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Get couple info
 */
const getCoupleInfo = async (req, res) => {
    try {
        const userId = req.userId;
        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true
        }).populate('partner1Id partner2Id', 'name photoUrl dob');

        if (!couple) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        res.json(successResponse(couple));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Get couple statistics
 */
const getCoupleStats = async (req, res) => {
    try {
        const userId = req.userId;
        const couple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true
        });

        if (!couple || !couple.startDate) {
            return res.json(successResponse({ days: 0, time: { years: 0, months: 0, days: 0 } }));
        }

        const timeTogether = calculateTimeTogether(couple.startDate);

        res.json(successResponse({
            startDate: couple.startDate,
            timeTogether
        }));
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

const devPair = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Check if current user already has a couple (paired or unpaired)
        const existingCouple = await Couple.findOne({
            $or: [{ partner1Id: userId }, { partner2Id: userId }],
            isActive: true
        });

        // 2. If already paired, unpair and delete the old couple
        if (existingCouple) {
            const partner1Id = existingCouple.partner1Id;
            const partner2Id = existingCouple.partner2Id;

            // Clear coupleId from both users
            if (partner1Id) {
                await User.findByIdAndUpdate(partner1Id, { $unset: { coupleId: "" } });
            }
            if (partner2Id) {
                await User.findByIdAndUpdate(partner2Id, { $unset: { coupleId: "" } });
            }

            // Delete the old couple
            await Couple.findByIdAndDelete(existingCouple._id);
        }

        // 3. Find or create dummy partner
        let dummy = await User.findOne({ email: 'partner@closeus.dev' });

        if (!dummy) {
            dummy = await User.create({
                email: 'partner@closeus.dev',
                name: 'Dev Partner',
                profilePicture: 'https://ui-avatars.com/api/?name=Dev+Partner',
                isOnboarded: true,
            });
        } else {
            // Clear dummy user's coupleId if exists
            await User.findByIdAndUpdate(dummy._id, { $unset: { coupleId: "" } });
        }

        // 4. Check if dummy has an old couple and delete it
        const dummyOldCouple = await Couple.findOne({
            $or: [{ partner1Id: dummy._id }, { partner2Id: dummy._id }],
            isActive: true
        });

        if (dummyOldCouple) {
            await Couple.findByIdAndDelete(dummyOldCouple._id);
        }

        // 5. Get current user info
        const currentUser = await User.findById(userId);

        // 6. Create new couple
        const coupleTag = generateCoupleTag(currentUser.name, dummy.name);
        const couple = await Couple.create({
            partner1Id: userId,
            partner2Id: dummy._id,
            isPaired: true,
            coupleTag,
            startDate: currentUser.anniversary || new Date(),
            isActive: true
        });

        // 7. Update both users with new coupleId
        await User.findByIdAndUpdate(userId, { coupleId: couple._id });
        await User.findByIdAndUpdate(dummy._id, { coupleId: couple._id });

        res.json(successResponse({ couple, coupleTag }, 'Dev pairing successful'));
    } catch (error) {
        console.error('Dev pairing error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    createPairingKey,
    pairWithPartner,
    getCoupleInfo,
    getCoupleStats,
    devPair
};
