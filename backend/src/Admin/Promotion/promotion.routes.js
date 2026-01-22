const express = require('express');
const router = express.Router();
const promotionController = require('./promotion.controller');
const adminAuthMiddleware = require('../Middleware/auth.middleware');

router.use(adminAuthMiddleware);

router.post('/', promotionController.createPromotion);
router.get('/', promotionController.getPromotions);
router.put('/:id', promotionController.updatePromotion);
router.delete('/:id', promotionController.deletePromotion);
router.get('/:id/usage', promotionController.getPromotionUsage);

module.exports = router;
