const Promotion = require('../../models/Promotion');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// Create promotion
exports.createPromotion = async (req, res) => {
    try {
        const promotion = new Promotion({
            ...req.body,
            createdBy: req.adminId,
        });

        await promotion.save();

        res.status(201).json(successResponse(promotion, 'Promotion created'));
    } catch (error) {
        console.error('Error creating promotion:', error);
        if (error.code === 11000) {
            return res.status(400).json(errorResponse('Promotion code already exists'));
        }
        res.status(500).json(errorResponse('Failed to create promotion'));
    }
};

// Get all promotions
exports.getPromotions = async (req, res) => {
    try {
        const { isActive, type, page = 1, limit = 20 } = req.query;

        const query = {};
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (type) query.type = type;

        const promotions = await Promotion.find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Promotion.countDocuments(query);

        res.json(successResponse({
            promotions,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        }));
    } catch (error) {
        console.error('Error fetching promotions:', error);
        res.status(500).json(errorResponse('Failed to fetch promotions'));
    }
};

// Update promotion
exports.updatePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!promotion) {
            return res.status(404).json(errorResponse('Promotion not found', 404));
        }

        res.json(successResponse(promotion, 'Promotion updated'));
    } catch (error) {
        console.error('Error updating promotion:', error);
        res.status(500).json(errorResponse('Failed to update promotion'));
    }
};

// Delete promotion
exports.deletePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findByIdAndDelete(req.params.id);

        if (!promotion) {
            return res.status(404).json(errorResponse('Promotion not found', 404));
        }

        res.json(successResponse(null, 'Promotion deleted'));
    } catch (error) {
        console.error('Error deleting promotion:', error);
        res.status(500).json(errorResponse('Failed to delete promotion'));
    }
};

// Get promotion usage stats
exports.getPromotionUsage = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id)
            .populate('usedBy.userId', 'name email');

        if (!promotion) {
            return res.status(404).json(errorResponse('Promotion not found', 404));
        }

        const usageRate = promotion.usageLimit
            ? (promotion.usedCount / promotion.usageLimit * 100).toFixed(2)
            : 0;

        res.json(successResponse({
            code: promotion.code,
            usedCount: promotion.usedCount,
            usageLimit: promotion.usageLimit,
            usageRate,
            recentUsages: promotion.usedBy.slice(-10).reverse(),
        }));
    } catch (error) {
        console.error('Error fetching promotion usage:', error);
        res.status(500).json(errorResponse('Failed to fetch usage stats'));
    }
};

// Validate and redeem promotion (called from mobile app)
exports.redeemPromotion = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.userId;

        const promotion = await Promotion.findOne({
            code: code.toUpperCase(),
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
        });

        if (!promotion) {
            return res.status(404).json(errorResponse('Invalid or expired promotion code', 404));
        }

        // Check usage limit
        if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
            return res.status(400).json(errorResponse('Promotion limit reached'));
        }

        // Check if user already used
        const alreadyUsed = promotion.usedBy.some(u => u.userId.toString() === userId);
        if (alreadyUsed) {
            return res.status(400).json(errorResponse('You have already used this promotion'));
        }

        // Redeem
        promotion.usedBy.push({ userId });
        promotion.usedCount += 1;
        await promotion.save();

        res.json(successResponse({
            title: promotion.title,
            description: promotion.description,
            type: promotion.type,
            value: promotion.value,
            applicableTo: promotion.applicableTo,
        }, 'Promotion redeemed successfully'));
    } catch (error) {
        console.error('Error redeeming promotion:', error);
        res.status(500).json(errorResponse('Failed to redeem promotion'));
    }
};
