const express = require('express');
const router = express.Router();
const featureController = require('./feature.controller');
const adminAuthMiddleware = require('../Middleware/auth.middleware');

router.use(adminAuthMiddleware);

// ------------------------------------------------------------------
// Feature Routes
// ------------------------------------------------------------------
router.post('/', featureController.createFeatureFlag);
router.get('/', featureController.getFeatureFlags);
router.put('/:id', featureController.updateFeatureFlag);
router.post('/:id/toggle', featureController.toggleFeatureFlag);
router.put('/:id/rollout', featureController.updateRollout);

module.exports = router;
