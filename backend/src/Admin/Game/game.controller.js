const GameCategory = require('../../models/GameCategory');
const GameQuestion = require('../../models/GameQuestion');
const { successResponse, errorResponse } = require('../../Shared/Utils');

/**
 * Create Game Category
 */
const createGameCategory = async (req, res) => {
    try {
        const { gameType, name, emoji, tags, color } = req.body;

        const category = await GameCategory.create({
            gameType,
            name,
            emoji,
            tags: tags || [],
            color,
        });

        res.status(201).json(successResponse(category, 'Game category created'));
    } catch (error) {
        console.error('Create game category error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Get All Game Categories
 */
const getGameCategories = async (req, res) => {
    try {
        const { gameType } = req.query;
        const query = gameType ? { gameType } : {};

        const categories = await GameCategory.find(query).sort({ order: 1, timesPlayed: -1 });

        // Get question count for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const questionCount = await GameQuestion.countDocuments({ categoryId: cat._id });
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

/**
 * Update Game Category
 */
const updateGameCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const category = await GameCategory.findByIdAndUpdate(id, updates, { new: true });
        if (!category) {
            return res.status(404).json(errorResponse('Category not found', 404));
        }

        res.json(successResponse(category, 'Category updated'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Delete Game Category
 */
const deleteGameCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category has questions
        const questionCount = await GameQuestion.countDocuments({ categoryId: id });
        if (questionCount > 0) {
            return res.status(400).json(errorResponse('Cannot delete category with questions', 400));
        }

        await GameCategory.findByIdAndDelete(id);
        res.json(successResponse(null, 'Category deleted'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Create Game Question
 */
const createGameQuestion = async (req, res) => {
    try {
        const { categoryId, text } = req.body;

        const question = await GameQuestion.create({
            categoryId,
            text,
        });

        res.status(201).json(successResponse(question, 'Game question created'));
    } catch (error) {
        console.error('Create game question error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Get Game Questions by Category
 */
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

/**
 * Update Game Question
 */
const updateGameQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const question = await GameQuestion.findByIdAndUpdate(id, updates, { new: true });
        if (!question) {
            return res.status(404).json(errorResponse('Question not found', 404));
        }

        res.json(successResponse(question, 'Question updated'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Delete Game Question
 */
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
    getGameQuestions,
    updateGameQuestion,
    deleteGameQuestion,
};
