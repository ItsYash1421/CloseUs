const GameCategory = require('../../models/GameCategory');
const GameQuestion = require('../../models/GameQuestion');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// ------------------------------------------------------------------
// Create Game Category
// ------------------------------------------------------------------
const createGameCategory = async (req, res) => {
    try {
        const { name, emoji, tags, color } = req.body;

        const category = await GameCategory.create({
            name,
            emoji,
            tags: tags || [],
            color,
        });

        res.status(201).json(successResponse(category, 'Game category created'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get All Game Categories
// ------------------------------------------------------------------
const getGameCategories = async (req, res) => {
    try {
        const categoriesWithCount = await GameCategory.aggregate([
            { $sort: { order: 1, timesPlayed: -1 } },
            {
                $lookup: {
                    from: 'gamequestions',
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
// Update Game Category
// ------------------------------------------------------------------
const updateGameCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedFields = ['name', 'emoji', 'tags', 'color', 'order', 'isActive', 'gameType'];
        const updates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        const category = await GameCategory.findByIdAndUpdate(id, updates, { new: true });
        if (!category) {
            return res.status(404).json(errorResponse('Category not found', 404));
        }

        res.json(successResponse(category, 'Category updated'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Delete Game Category
// ------------------------------------------------------------------
const deleteGameCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // ------------------------------------------------------------------
        // Check for Existing Questions
        // ------------------------------------------------------------------
        const questionCount = await GameQuestion.countDocuments({ categoryId: id });
        if (questionCount > 0) {
            return res
                .status(400)
                .json(errorResponse('Cannot delete category with questions', 400));
        }

        await GameCategory.findByIdAndDelete(id);
        res.json(successResponse(null, 'Category deleted'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Create Game Question
// ------------------------------------------------------------------
const createGameQuestion = async (req, res) => {
    try {
        const { categoryId, text } = req.body;

        const question = await GameQuestion.create({
            categoryId,
            text,
        });

        res.status(201).json(successResponse(question, 'Game question created'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get All Game Questions (Across All Categories)
// ------------------------------------------------------------------
const getAllGameQuestions = async (req, res) => {
    try {
        const { page = 1, limit = 100 } = req.query;

        const questions = await GameQuestion.find()
            .populate('categoryId', 'name emoji color')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await GameQuestion.countDocuments();

        res.json(
            successResponse({
                questions,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            })
        );
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get Game Questions by Category
// ------------------------------------------------------------------
const getGameQuestions = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const questions = await GameQuestion.find({ categoryId })
            .sort({ order: 1, createdAt: -1 })
            .populate('categoryId', 'name gameType');

        res.json(successResponse(questions));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Update Game Question
// ------------------------------------------------------------------
const updateGameQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedFields = ['text', 'categoryId', 'isActive', 'order'];
        const updates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        const question = await GameQuestion.findByIdAndUpdate(id, updates, { new: true });
        if (!question) {
            return res.status(404).json(errorResponse('Question not found', 404));
        }

        res.json(successResponse(question, 'Question updated'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Delete Game Question
// ------------------------------------------------------------------
const deleteGameQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        await GameQuestion.findByIdAndDelete(id);
        res.json(successResponse(null, 'Question deleted'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    createGameCategory,
    getGameCategories,
    updateGameCategory,
    deleteGameCategory,
    createGameQuestion,
    getAllGameQuestions,
    getGameQuestions,
    updateGameQuestion,
    deleteGameQuestion,
};
