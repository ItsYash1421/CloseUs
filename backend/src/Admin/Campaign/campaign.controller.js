const Campaign = require('../../models/Campaign');
const User = require('../../models/User');
const Couple = require('../../models/Couple');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// ------------------------------------------------------------------
// Create New Campaign
// ------------------------------------------------------------------
exports.createCampaign = async (req, res) => {
    try {
        const campaign = new Campaign({
            ...req.body,
            createdBy: req.adminId,
        });

        await campaign.save();

        res.status(201).json(successResponse(campaign, 'Campaign created successfully'));
    } catch (error) {
        console.error('Error creating campaign:', error);
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
        console.error('Error fetching campaigns:', error);
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
        console.error('Error fetching campaign:', error);
        res.status(500).json(errorResponse('Failed to fetch campaign'));
    }
};

// ------------------------------------------------------------------
// Update Campaign
// ------------------------------------------------------------------
exports.updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!campaign) {
            return res.status(404).json(errorResponse('Campaign not found', 404));
        }

        res.json(successResponse(campaign, 'Campaign updated successfully'));
    } catch (error) {
        console.error('Error updating campaign:', error);
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
        console.error('Error deleting campaign:', error);
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
        const targetQuery = {};

        if (!campaign.targetAudience.allUsers) {
            if (campaign.targetAudience.coupleStatus !== 'all') {
                const isPaired = campaign.targetAudience.coupleStatus === 'paired';
                const users = await User.find().populate('coupleId');
                const filteredUserIds = users
                    .filter((u) => (isPaired ? u.coupleId?.isPaired : !u.coupleId?.isPaired))
                    .map((u) => u._id);
                targetQuery._id = { $in: filteredUserIds };
            }
        }

        const targetUsers = await User.find(targetQuery);

        // ------------------------------------------------------------------
        // Update Metrics
        // ------------------------------------------------------------------
        campaign.status = 'active';
        campaign.metrics.sent = targetUsers.length;
        await campaign.save();

        // TODO: Send notifications to target users

        res.json(successResponse(campaign, 'Campaign launched successfully'));
    } catch (error) {
        console.error('Error launching campaign:', error);
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
        console.error('Error pausing campaign:', error);
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
        console.error('Error fetching campaign metrics:', error);
        res.status(500).json(errorResponse('Failed to fetch metrics'));
    }
};
