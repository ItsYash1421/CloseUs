const Campaign = require('../../models/Campaign');
const User = require('../../models/User');
const Couple = require('../../models/Couple');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// ------------------------------------------------------------------
// Create New Campaign
// ------------------------------------------------------------------
exports.createCampaign = async (req, res) => {
    try {
        const { schedule, ...campaignData } = req.body;

        // ------------------------------------------------------------------
        // Extract startDate and endDate from schedule object
        // ------------------------------------------------------------------
        const campaign = new Campaign({
            ...campaignData,
            startDate: schedule?.startDate,
            endDate: schedule?.endDate,
            createdBy: req.adminId,
        });

        await campaign.save();

        res.status(201).json(successResponse(campaign, 'Campaign created successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to create campaign'));
    }
};

// ------------------------------------------------------------------
// Get All Campaigns
// ------------------------------------------------------------------
exports.getCampaigns = async (req, res) => {
    try {
        const { status, type, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const campaigns = await Campaign.find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Campaign.countDocuments(query);

        res.json(
            successResponse({
                campaigns,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            })
        );
    } catch (error) {
        res.status(500).json(errorResponse('Failed to fetch campaigns'));
    }
};

// ------------------------------------------------------------------
// Get Campaign By ID
// ------------------------------------------------------------------
exports.getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('createdBy', 'name email');

        if (!campaign) {
            return res.status(404).json(errorResponse('Campaign not found', 404));
        }

        res.json(successResponse(campaign));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to fetch campaign'));
    }
};

// ------------------------------------------------------------------
// Update Campaign
// ------------------------------------------------------------------
exports.updateCampaign = async (req, res) => {
    try {
        const allowedFields = [
            'name',
            'description',
            'type',
            'status',
            'targetAudience',
            'content',
            'startDate',
            'endDate',
        ];
        const updates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        const campaign = await Campaign.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        if (!campaign) {
            return res.status(404).json(errorResponse('Campaign not found', 404));
        }

        res.json(successResponse(campaign, 'Campaign updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to update campaign'));
    }
};

// ------------------------------------------------------------------
// Delete Campaign
// ------------------------------------------------------------------
exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);

        if (!campaign) {
            return res.status(404).json(errorResponse('Campaign not found', 404));
        }

        res.json(successResponse(null, 'Campaign deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to delete campaign'));
    }
};

// ------------------------------------------------------------------
// Launch Campaign
// ------------------------------------------------------------------
exports.launchCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json(errorResponse('Campaign not found', 404));
        }

        // ------------------------------------------------------------------
        // Identify Target Audience
        // ------------------------------------------------------------------
        let targetUsers;

        if (campaign.targetAudience.allUsers || campaign.targetAudience.coupleStatus === 'all') {
            targetUsers = await User.find();
        } else {
            const isPaired = campaign.targetAudience.coupleStatus === 'paired';
            const pairedCoupleIds = await Couple.find({ isPaired: true }).distinct('_id');

            if (isPaired) {
                targetUsers = await User.find({ coupleId: { $in: pairedCoupleIds } });
            } else {
                targetUsers = await User.find({
                    $or: [
                        { coupleId: { $exists: false } },
                        { coupleId: null },
                        { coupleId: { $nin: pairedCoupleIds } },
                    ],
                });
            }
        }

        // ------------------------------------------------------------------
        // Update Metrics
        // ------------------------------------------------------------------
        campaign.status = 'active';
        campaign.metrics.sent = targetUsers.length;
        await campaign.save();

        // TODO: Send notifications to target users

        res.json(successResponse(campaign, 'Campaign launched successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to launch campaign'));
    }
};

// ------------------------------------------------------------------
// Pause Campaign
// ------------------------------------------------------------------
exports.pauseCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { status: 'paused' },
            { new: true }
        );

        if (!campaign) {
            return res.status(404).json(errorResponse('Campaign not found', 404));
        }

        res.json(successResponse(campaign, 'Campaign paused successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to pause campaign'));
    }
};

// ------------------------------------------------------------------
// Get Campaign Metrics
// ------------------------------------------------------------------
exports.getCampaignMetrics = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json(errorResponse('Campaign not found', 404));
        }

        const metrics = {
            sent: campaign.metrics.sent,
            viewed: campaign.metrics.viewed,
            clicked: campaign.metrics.clicked,
            converted: campaign.metrics.converted,
            viewRate:
                campaign.metrics.sent > 0
                    ? ((campaign.metrics.viewed / campaign.metrics.sent) * 100).toFixed(2)
                    : 0,
            clickRate:
                campaign.metrics.viewed > 0
                    ? ((campaign.metrics.clicked / campaign.metrics.viewed) * 100).toFixed(2)
                    : 0,
            conversionRate:
                campaign.metrics.clicked > 0
                    ? ((campaign.metrics.converted / campaign.metrics.clicked) * 100).toFixed(2)
                    : 0,
        };

        res.json(successResponse(metrics));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to fetch metrics'));
    }
};
