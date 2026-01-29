const express = require('express');
const router = express.Router();
const gameController = require('./game.controller');
const adminAuthMiddleware = require('../Middleware/auth.middleware');

router.use(adminAuthMiddleware);

// ------------------------------------------------------------------
// Game Categories Routes
// ------------------------------------------------------------------
router.post('/categories', gameController.createGameCategory);
router.get('/categories', gameController.getGameCategories);
router.put('/categories/:id', gameController.updateGameCategory);
router.delete('/categories/:id', gameController.deleteGameCategory);

// ------------------------------------------------------------------
// Game Questions Routes
// ------------------------------------------------------------------
router.get('/questions', gameController.getAllGameQuestions);
router.post('/questions', gameController.createGameQuestion);
router.get('/questions/category/:categoryId', gameController.getGameQuestions);
router.put('/questions/:id', gameController.updateGameQuestion);
router.delete('/questions/:id', gameController.deleteGameQuestion);

module.exports = router;
