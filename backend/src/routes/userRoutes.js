const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.put('/me', userController.updateProfile);
router.post('/update-push-token', userController.updatePushToken);
router.get('/:id', userController.getUserById);

module.exports = router;
