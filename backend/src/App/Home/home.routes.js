const express = require('express');
const dailyQuestionController = require('./dailyQuestion.controller');
const authMiddleware = require('../Middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// ------------------------------------------------------------------
// Daily Question Routes
// ------------------------------------------------------------------
router.get('/questions/daily', dailyQuestionController.getDailyQuestion);
router.post('/questions/daily/:id/answer', dailyQuestionController.answerDailyQuestion);
router.delete('/questions/daily/:id/answer', dailyQuestionController.deleteDailyAnswer);

module.exports = router;
