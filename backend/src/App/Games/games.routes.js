const express = require('express');
const router = express.Router();
const gamesController = require('./games.controller');
const authMiddleware = require('../Middleware/auth.middleware');

// ------------------------------------------------------------------
// Public Game Routes (Authenticated)
// ------------------------------------------------------------------
router.use(authMiddleware);

// ------------------------------------------------------------------
// Get All Game Categories
// ------------------------------------------------------------------
router.get('/categories', gamesController.getGameCategories);

// ------------------------------------------------------------------
// Get Questions by Category
// ------------------------------------------------------------------
router.get('/questions/:categoryId', gamesController.getQuestionsByCategory);

// ------------------------------------------------------------------
// Get Random Game Question
// ------------------------------------------------------------------
router.get('/random-game', gamesController.getRandomGame);

module.exports = router;
