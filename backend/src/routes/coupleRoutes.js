const express = require('express');
const coupleController = require('../controllers/coupleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/create-key', coupleController.createPairingKey);
router.post('/refresh-key', coupleController.refreshPairingKey);
router.get('/check-pairing-status', coupleController.checkPairingStatus);
router.post('/pair', coupleController.pairWithPartner);
router.get('/me', coupleController.getCoupleInfo);
router.get('/stats', coupleController.getCoupleStats);

// Dev Only
router.post('/dev-pair', coupleController.devPair);

module.exports = router;
