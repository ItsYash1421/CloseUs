const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const adminAuthMiddleware = require('../Middleware/auth.middleware');

router.use(adminAuthMiddleware);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/users', dashboardController.getUsers);
router.get('/couples', dashboardController.getCouples);

module.exports = router;
