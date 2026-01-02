const express = require('express');
const router = express.Router();
const coupleController = require('../controllers/coupleController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.post('/create-key', authMiddleware, coupleController.createPairingKey);
router.post('/pair', authMiddleware, coupleController.pairWithPartner);
router.get('/me', authMiddleware, coupleController.getCoupleInfo);
router.put('/me', authMiddleware, coupleController.updateCouple);
router.get('/stats', authMiddleware, coupleController.getCoupleStats);

module.exports = router;
