const express = require('express');
const router = express.Router();
const questionController = require('./question.controller');
const adminAuthMiddleware = require('../Middleware/auth.middleware');

router.use(adminAuthMiddleware);

// ------------------------------------------------------------------
// Question Categories Routes
// ------------------------------------------------------------------
router.post('/categories', questionController.createCategory);
router.get('/categories', questionController.getCategories);
router.put('/categories/:id', questionController.updateCategory);
router.delete('/categories/:id', questionController.deleteCategory);

// ------------------------------------------------------------------
// Questions Routes
// ------------------------------------------------------------------
router.post('/', questionController.createQuestion);
router.get('/', questionController.getAllQuestions); // Get all questions
router.get('/category/:categoryId', questionController.getQuestionsByCategory);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
