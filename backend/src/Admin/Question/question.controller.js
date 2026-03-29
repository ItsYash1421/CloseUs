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
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get All Categories
// ------------------------------------------------------------------
const getCategories = async (req, res) => {
    try {
        const categoriesWithCount = await QuestionCategory.aggregate([
            { $sort: { order: 1, createdAt: -1 } },
            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'categoryId',
                    as: 'questions',
                },
            },
            {
                $addFields: {
                    questionCount: { $size: '$questions' },
                },
            },
            { $project: { questions: 0 } },
        ]);

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
        const allowedFields = ['name', 'description', 'emoji', 'color', 'order'];
        const updates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

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
        const allowedFields = ['text', 'categoryId', 'isDaily', 'isActive', 'order'];
        const updates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

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
