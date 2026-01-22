const express = require('express');
const coupleController = require('./couple.controller');
const authMiddleware = require('../Middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/create-key', coupleController.createPairingKey);
router.post('/refresh-key', coupleController.refreshPairingKey);
router.get('/check-pairing-status', coupleController.checkPairingStatus);
router.post('/pair', coupleController.pairWithPartner);
router.get('/me', coupleController.getCoupleInfo);
router.get('/stats', coupleController.getCoupleStats);
router.get('/time-together', coupleController.getTimeTogether);

// ------------------------------------------------------------------
// Development Routes
// ------------------------------------------------------------------
router.post('/dev-pair', coupleController.devPair);
router.post('/enable-dev-mode', coupleController.enableDevMode);

module.exports = router;
