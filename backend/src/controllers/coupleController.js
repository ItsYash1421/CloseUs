const Couple = require('../models/Couple');
const User = require('../models/User');
const {
    generatePairingKey,
    generateCoupleTag,
    calculateTimeTogether,
    getNextMilestone,
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
            return res.json(successResponse({
                pairingKey: existingCouple.pairingKey,
                pairingKeyExpires: existingCouple.pairingKeyExpires
            }, 'Pending pairing found'));
        }

        // Generate unique key
        let pairingKey;
        let isUnique = false;
        while (!isUnique) {
            pairingKey = generatePairingKey();
            const duplicate = await Couple.findOne({ pairingKey });
            if (!duplicate) isUnique = true;
        }

        // Create expiry: 6 hours from now
        const expiryTime = new Date(Date.now() + (6 * 60 * 60 * 1000));

        // Create couple document
        const couple = await Couple.create({
            partner1Id: userId,
            pairingKey,
            pairingKeyExpires: expiryTime
        });

        res.status(201).json(successResponse({
            pairingKey: couple.pairingKey,
            pairingKeyExpires: couple.pairingKeyExpires
        }, 'Pairing key generated'));
    } catch (error) {
        console.error('Create pairing key error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Refresh pairing key (generate new key with 6hr expiry)
 */
const refreshPairingKey = async (req, res) => {
    try {
        const userId = req.userId;

        // Find user's pending couple
        const couple = await Couple.findOne({
            partner1Id: userId,
            isPaired: false,
            isActive: true
        });

        if (!couple) {
            return res.status(404).json(errorResponse('No pending pairing found', 404));
        }

        // Generate new unique key
        let pairingKey;
        let isUnique = false;
        while (!isUnique) {
            pairingKey = generatePairingKey();
            const duplicate = await Couple.findOne({ pairingKey });
            if (!duplicate) isUnique = true;
        }

        // Create expiry: 6 hours from now
        const expiryTime = new Date(Date.now() + (6 * 60 * 60 * 1000));

        // Update couple with new key and expiry
        couple.pairingKey = pairingKey;
        couple.pairingKeyExpires = expiryTime;
        await couple.save();

        res.json(successResponse({
            pairingKey: couple.pairingKey,
            pairingKeyExpires: couple.pairingKeyExpires
        }, 'Pairing key refreshed'));
    } catch (error) {
        console.error('Refresh pairing key error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Check pairing status (polling endpoint)
 */
const checkPairingStatus = async (req, res) => {
    try {
        const userId = req.userId;

        // Check if user has been paired
        const user = await User.findById(userId).populate('coupleId');

        if (user.coupleId && user.coupleId.isPaired) {
            return res.json(successResponse({
                isPaired: true,
                couple: user.coupleId
            }, 'User is paired'));
        }

        res.json(successResponse({
            isPaired: false
        }, 'User not paired yet'));
    } catch (error) {
        console.error('Check pairing status error:', error);
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
        console.error('Pair with partner error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Get couple information
 */
const getCoupleInfo = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate('coupleId');

        if (!user.coupleId) {
            return res.status(404).json(errorResponse('Not paired yet', 404));
        }

        // Get partner info
        const couple = user.coupleId;
        const partnerId = couple.partner1Id.toString() === userId
            ? couple.partner2Id
            : couple.partner1Id;

        const partner = await User.findById(partnerId);

        res.json(successResponse({
            couple,
            partner: {
                name: partner.name,
                photoUrl: partner.photoUrl,
                gender: partner.gender
            }
        }, 'Couple information'));
    } catch (error) {
        console.error('Get couple info error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

const getCoupleStats = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate('coupleId');
        const couple = user.coupleId;

        if (!couple) {
            return res.status(404).json(errorResponse('Not paired yet', 404));
        }

        // Get partner info to regenerate tag if needed
        const partnerId = couple.partner1Id.toString() === userId ? couple.partner2Id : couple.partner1Id;
        const partner = await User.findById(partnerId);
        const currentUser = await User.findById(userId);

        // Check if coupleTag needs regeneration (old format or missing)
        const expectedTag = generateCoupleTag(currentUser.name, partner.name);
        if (!couple.coupleTag || couple.coupleTag !== expectedTag) {
            couple.coupleTag = expectedTag;
            await couple.save();
        }

        const timeTogether = calculateTimeTogether(couple.startDate);
        const currentDays = timeTogether.days;
        const nextMilestone = getNextMilestone(currentDays);
        const progressPercentage = Math.floor((currentDays / nextMilestone) * 100);

        res.json(successResponse({
            ...timeTogether,
            startDate: couple.startDate,
            coupleTag: couple.coupleTag,
            milestone: {
                current: currentDays,
                next: nextMilestone,
                progress: progressPercentage
            }
        }));
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

const getTimeTogether = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate('coupleId');
        const couple = user.coupleId;

        if (!couple) {
            return res.status(404).json(errorResponse('Not paired yet', 404));
        }

        const timeTogether = calculateTimeTogether(couple.startDate);

        res.json(successResponse(timeTogether));
    } catch (error) {
        console.error('Get time together error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};


//----------------------------------------------------//DEV//----------------------------------------------------//

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

            // Clear coupleId from both partner users
            await User.findByIdAndUpdate(partner1Id, { coupleId: null });
            if (partner2Id) {
                await User.findByIdAndUpdate(partner2Id, { coupleId: null });
            }

            // Delete the couple
            await Couple.findByIdAndDelete(existingCouple._id);
        }

        // 3. Find or create dummy partner
        let dummyPartner = await User.findOne({ email: 'dummy@closeus.app' });

        if (!dummyPartner) {
            // Create dummy partner
            dummyPartner = await User.create({
                email: `dummy_${Date.now()}@closeus.dev`,
                googleId: 'DUMMY_PARTNER_' + Date.now(),
                name: 'Dummy Partner',
                gender: 'female', // assuming opposite gender for variety
                dob: new Date('2000-01-01'),
                relationshipStatus: 'dating',
                livingStyle: 'living_together',
                anniversary: new Date()
            });
        }

        // 4. Check if dummy partner has an existing couple
        const dummyCouple = await Couple.findOne({
            $or: [{ partner1Id: dummyPartner._id }, { partner2Id: dummyPartner._id }],
            isActive: true
        });

        if (dummyCouple) {
            // Clear dummy's old partnership
            const dp1 = dummyCouple.partner1Id;
            const dp2 = dummyCouple.partner2Id;

            await User.findByIdAndUpdate(dp1, { coupleId: null });
            if (dp2) {
                await User.findByIdAndUpdate(dp2, { coupleId: null });
            }

            await Couple.findByIdAndDelete(dummyCouple._id);
        }

        // 5. Create new couple
        const currentUser = await User.findById(userId);

        const newDummyPartner = await User.create({
            email: `devpartner_${Date.now()}@closeus.dev`,
            googleId: 'DEV_PARTNER_' + Date.now(),
            name: 'Dev Partner',
            gender: currentUser.gender === 'male' ? 'female' : 'male',
            relationshipStatus: 'dating',
            livingStyle: 'living_together',
            partnerName: currentUser.name,
            anniversary: currentUser.anniversary || new Date(),
            isOnboarded: true,
            lastActive: new Date() // Set as online
        });

        const coupleTag = generateCoupleTag(currentUser.name, newDummyPartner.name);

        const newCouple = await Couple.create({
            partner1Id: userId,
            partner2Id: newDummyPartner._id,
            isPaired: true,
            coupleTag: coupleTag,
            startDate: currentUser.anniversary || new Date(),
            isDevPartner: true // Mark as dev partnership
        });

        // 6. Update both users
        await User.findByIdAndUpdate(userId, { coupleId: newCouple._id });
        await User.findByIdAndUpdate(newDummyPartner._id, { coupleId: newCouple._id });

        res.json(successResponse({ couple: newCouple }, 'Dev pair successful'));
    } catch (error) {
        console.error('Dev pair error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Enable Dev Mode for existing couple
 */
const enableDevMode = async (req, res) => {
    try {
        const userId = req.userId;

        // Find user's couple
        const user = await User.findById(userId);
        if (!user || !user.coupleId) {
            return res.status(404).json(errorResponse('No couple found', 404));
        }

        // Update couple to enable dev mode
        const couple = await Couple.findByIdAndUpdate(
            user.coupleId,
            { isDevPartner: true },
            { new: true }
        );

        if (!couple) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        res.json(successResponse({ couple }, 'Dev mode enabled for this couple'));
    } catch (error) {
        console.error('Enable dev mode error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    createPairingKey,
    refreshPairingKey,
    checkPairingStatus,
    pairWithPartner,
    getCoupleInfo,
    getCoupleStats,
    getTimeTogether,
    devPair,
    enableDevMode
};
