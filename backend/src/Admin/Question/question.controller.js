const QuestionCategory = require('../../models/QuestionCategory');
const Question = require('../../models/Question');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// ------------------------------------------------------------------
// Create Question Category
// ------------------------------------------------------------------
const createCategory = async (req, res) => {
    try {
        const { name, description, emoji, color } = req.body;

        const category = await QuestionCategory.create({
            name,
            description,
            emoji,
            color,
        });

        res.status(201).json(successResponse(category, 'Category created'));
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get All Categories
// ------------------------------------------------------------------
const getCategories = async (req, res) => {
    try {
        const categories = await QuestionCategory.find().sort({ order: 1, createdAt: -1 });

        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const questionCount = await Question.countDocuments({ categoryId: cat._id });
                return {
                    ...cat.toObject(),
                    questionCount,
                };
            })
        );

        res.json(successResponse(categoriesWithCount));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Update Category
// ------------------------------------------------------------------
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const category = await QuestionCategory.findByIdAndUpdate(id, updates, { new: true });
        if (!category) {
            return res.status(404).json(errorResponse('Category not found', 404));
        }

        res.json(successResponse(category, 'Category updated'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Delete Category
// ------------------------------------------------------------------
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const questionCount = await Question.countDocuments({ categoryId: id });
        if (questionCount > 0) {
            return res
                .status(400)
                .json(errorResponse('Cannot delete category with questions', 400));
        }

        await QuestionCategory.findByIdAndDelete(id);
        res.json(successResponse(null, 'Category deleted'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get All Questions
// ------------------------------------------------------------------
const getAllQuestions = async (req, res) => {
    try {
        const { page = 1, limit = 50, categoryId } = req.query;

        const query = categoryId ? { categoryId } : {};

        const questions = await Question.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('categoryId', 'name emoji color');

        const total = await Question.countDocuments(query);

        res.json(
            successResponse({
                questions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit)),
                },
            })
        );
    } catch (error) {
        console.error('Get all questions error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Create Question
// ------------------------------------------------------------------
const createQuestion = async (req, res) => {
    try {
        const { categoryId, text, isDaily } = req.body;

        const question = await Question.create({
            categoryId,
            text,
            isDaily: isDaily || false,
        });

        res.status(201).json(successResponse(question, 'Question created'));
    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get Questions by Category
// ------------------------------------------------------------------
const getQuestionsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const questions = await Question.find({ categoryId })
            .sort({ order: 1, createdAt: -1 })
            .populate('categoryId', 'name');

        res.json(successResponse(questions));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Update Question
// ------------------------------------------------------------------
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const question = await Question.findByIdAndUpdate(id, updates, { new: true });
        if (!question) {
            return res.status(404).json(errorResponse('Question not found', 404));
        }

        res.json(successResponse(question, 'Question updated'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Delete Question
// ------------------------------------------------------------------
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        await Question.findByIdAndDelete(id);
        res.json(successResponse(null, 'Question deleted'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getAllQuestions,
    createQuestion,
    getQuestionsByCategory,
    updateQuestion,
    deleteQuestion,
};
