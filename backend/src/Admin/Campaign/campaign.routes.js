const express = require('express');
const router = express.Router();
const campaignController = require('./campaign.controller');
const adminAuthMiddleware = require('../Middleware/auth.middleware');

router.use(adminAuthMiddleware);

// ------------------------------------------------------------------
// Campaign Routes
// ------------------------------------------------------------------
router.post('/', campaignController.createCampaign);
router.get('/', campaignController.getCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.put('/:id', campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);
router.post('/:id/launch', campaignController.launchCampaign);
router.post('/:id/pause', campaignController.pauseCampaign);
router.get('/:id/metrics', campaignController.getCampaignMetrics);

module.exports = router;
