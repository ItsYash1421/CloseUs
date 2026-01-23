const GameCategory = require('../../models/GameCategory');
const GameQuestion = require('../../models/GameQuestion');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// ------------------------------------------------------------------
// Get All Game Categories (Public - For App)
// ------------------------------------------------------------------
const getGameCategories = async (req, res) => {
    try {
        const categories = await GameCategory.find({ isActive: true })
            .sort({ order: 1, timesPlayed: -1 })
            .select('-__v');

        // ------------------------------------------------------------------
        // Count Questions Per Category
        // ------------------------------------------------------------------
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const questionCount = await GameQuestion.countDocuments({
                    categoryId: cat._id,
                    isActive: true,
                });
                return {
                    ...cat.toObject(),
                    questionCount,
                };
            })
        );

        res.json(successResponse(categoriesWithCount));
    } catch (error) {
        console.error('Get game categories error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get Questions by Category (Public - For App)
// ------------------------------------------------------------------
const getQuestionsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // ------------------------------------------------------------------
        // Verify Category Exists
        // ------------------------------------------------------------------
        const category = await GameCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json(errorResponse('Category not found', 404));
        }

        // ------------------------------------------------------------------
        // Get Active Questions
        // ------------------------------------------------------------------
        const questions = await GameQuestion.find({
            categoryId,
            isActive: true,
        })
            .sort({ order: 1 })
            .select('-__v');

        res.json(
            successResponse({
                category: {
                    _id: category._id,
                    name: category.name,
                    emoji: category.emoji,
                    gameType: category.gameType,
                    color: category.color,
                },
                questions,
                totalQuestions: questions.length,
            })
        );
    } catch (error) {
        console.error('Get questions by category error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get Random Game Question (Public - For App)
// ------------------------------------------------------------------
const getRandomGame = async (req, res) => {
    try {
        // ------------------------------------------------------------------
        // Get All Active Categories
        // ------------------------------------------------------------------
        const activeCategories = await GameCategory.find({ isActive: true });

        if (activeCategories.length === 0) {
            return res.status(404).json(errorResponse('No active game categories found', 404));
        }

        // ------------------------------------------------------------------
        // Get All Active Questions from All Categories
        // ------------------------------------------------------------------
        const categoryIds = activeCategories.map((cat) => cat._id);
        const allQuestions = await GameQuestion.find({
            categoryId: { $in: categoryIds },
            isActive: true,
        }).populate('categoryId', 'name emoji gameType color');

        if (allQuestions.length === 0) {
            return res.status(404).json(errorResponse('No active questions found', 404));
        }

        // ------------------------------------------------------------------
        // Select Random Question
        // ------------------------------------------------------------------
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        const randomQuestion = allQuestions[randomIndex];

        // ------------------------------------------------------------------
        // Increment Times Played Counter
        // ------------------------------------------------------------------
        await GameQuestion.findByIdAndUpdate(randomQuestion._id, {
            $inc: { timesPlayed: 1 },
        });

        await GameCategory.findByIdAndUpdate(randomQuestion.categoryId._id, {
            $inc: { timesPlayed: 1 },
        });

        // ------------------------------------------------------------------
        // Format Response
        // ------------------------------------------------------------------
        res.json(
            successResponse({
                question: {
                    _id: randomQuestion._id,
                    text: randomQuestion.text,
                    timesPlayed: randomQuestion.timesPlayed + 1,
                },
                category: {
                    _id: randomQuestion.categoryId._id,
                    name: randomQuestion.categoryId.name,
                    emoji: randomQuestion.categoryId.emoji,
                    gameType: randomQuestion.categoryId.gameType,
                    color: randomQuestion.categoryId.color,
                },
            })
        );
    } catch (error) {
        console.error('Get random game error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    getGameCategories,
    getQuestionsByCategory,
    getRandomGame,
};
