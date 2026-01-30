const GameCategory = require('../../models/GameCategory');
const GameQuestion = require('../../models/GameQuestion');
const Couple = require('../../models/Couple');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// ------------------------------------------------------------------
// Get All Game Categories (Public - For App)
// ------------------------------------------------------------------
const getGameCategories = async (req, res) => {
    try {
        const categories = await GameCategory.find({ isActive: true })
            .sort({ order: 1, totalPlayed: -1 })
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
// ------------------------------------------------------------------
// Get Questions by Category (Protected - For App)
// ------------------------------------------------------------------
const getQuestionsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const userId = req.userId; // Middleware should populate this

        // ------------------------------------------------------------------
        // Verify Category Exists
        // ------------------------------------------------------------------
        const category = await GameCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json(errorResponse('Category not found', 404));
        }

        // ------------------------------------------------------------------
        // Get User and Couple Info
        // ------------------------------------------------------------------
        const User = require('../../models/User');
        const user = await User.findById(userId);
        const coupleId = user.coupleId;

        // ------------------------------------------------------------------
        // Get Active Questions
        // ------------------------------------------------------------------
        const questions = await GameQuestion.find({
            categoryId,
            isActive: true,
        })
            .sort({ order: 1 })
            .select('-__v');

        // ------------------------------------------------------------------
        // Get Answers for Couple
        // ------------------------------------------------------------------
        const GameAnswer = require('../../models/GameAnswer');
        let answers = [];
        if (coupleId) {
            answers = await GameAnswer.find({
                coupleId,
                questionId: { $in: questions.map(q => q._id) }
            });
        }

        // ------------------------------------------------------------------
        // Map Questions with Status
        // ------------------------------------------------------------------
        let userAnsweredCount = 0;
        let partnerAnsweredCount = 0;
        let bothAnsweredCount = 0;
        const totalQuestions = questions.length;

        const questionsWithStatus = questions.map(question => {
            const questionAnswers = answers.filter(a => a.questionId.toString() === question._id.toString());

            const userAnswer = questionAnswers.find(a => a.userId.toString() === userId.toString());
            const partnerAnswer = questionAnswers.find(a => a.userId.toString() !== userId.toString());

            const isAnsweredByUser = !!userAnswer;
            const isAnsweredByPartner = !!partnerAnswer;

            if (isAnsweredByUser) userAnsweredCount++;
            if (isAnsweredByPartner) partnerAnsweredCount++;
            if (isAnsweredByUser && isAnsweredByPartner) bothAnsweredCount++;

            return {
                ...question.toObject(),
                isAnsweredByUser,
                isAnsweredByPartner,
                // userResponse: isAnsweredByUser ? userAnswer.text : null, // Optional: if we want to show it immediately
            };
        });


        res.json(
            successResponse({
                category: {
                    _id: category._id,
                    name: category.name,
                    emoji: category.emoji,
                    gameType: category.gameType,
                    color: category.color,
                },
                questions: questionsWithStatus,
                stats: {
                    totalQuestions,
                    userAnsweredCount,
                    partnerAnsweredCount,
                    bothAnsweredCount
                }
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
        // Increment Times Played Counter (Optional: Logic for totalPlayed on random game?)
        // User asked to remove timesPlayed. Assuming simple removal.
        // ------------------------------------------------------------------
        // await GameQuestion.findByIdAndUpdate(randomQuestion._id, {
        //     $inc: { timesPlayed: 1 },
        // });
        // await GameCategory.findByIdAndUpdate(randomQuestion.categoryId._id, {
        //     $inc: { timesPlayed: 1 },
        // });
        // Keeping it commented out or removing entirely. Removing entirely is cleaner.

        // ------------------------------------------------------------------
        // Format Response
        // ------------------------------------------------------------------
        res.json(
            successResponse({
                question: {
                    _id: randomQuestion._id,
                    text: randomQuestion.text,
                    // timesPlayed removed
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

// ------------------------------------------------------------------
// Save Game Answer (Protected - For App)
// ------------------------------------------------------------------
const saveAnswer = async (req, res) => {
    try {
        const userId = req.userId;
        const { questionId, answer } = req.body;

        if (!questionId || !answer) {
            return res.status(400).json(errorResponse('Missing required fields', 400));
        }

        // ------------------------------------------------------------------
        // Verify Question Exists
        // ------------------------------------------------------------------
        const question = await GameQuestion.findById(questionId);
        if (!question) {
            return res.status(404).json(errorResponse('Question not found', 404));
        }

        // ------------------------------------------------------------------
        // Get User's Couple
        // ------------------------------------------------------------------
        const User = require('../../models/User');
        const user = await User.findById(userId);
        if (!user.coupleId) {
            return res.status(400).json(errorResponse('User not paired', 400));
        }

        // ------------------------------------------------------------------
        // Create or Update Answer (Upsert)
        // ------------------------------------------------------------------
        const GameAnswer = require('../../models/GameAnswer');

        // Check if answer already exists to determine if we should increment totalPlayed
        const existingAnswer = await GameAnswer.findOne({ userId, questionId });
        if (!existingAnswer) {
            await GameCategory.findByIdAndUpdate(question.categoryId, {
                $inc: { totalPlayed: 1 },
            });
        }

        const gameAnswer = await GameAnswer.findOneAndUpdate(
            { userId, questionId },
            {
                coupleId: user.coupleId,
                questionId,
                userId,
                text: answer,
            },
            { upsert: true, new: true }
        );

        res.json(
            successResponse(
                {
                    _id: gameAnswer._id,
                    questionId: gameAnswer.questionId,
                    answer: gameAnswer.text,
                },
                'Answer saved successfully'
            )
        );

        // ------------------------------------------------------------------
        // Dev Mode: Auto-Answer for Partner
        // ------------------------------------------------------------------
        const couple = await Couple.findById(user.coupleId);
        if (couple && couple.isDevPartner) {
            const partnerId = couple.partner1Id.toString() === userId.toString()
                ? couple.partner2Id
                : couple.partner1Id;
            setTimeout(async () => {
                try {
                    const existingPartnerAnswer = await GameAnswer.findOne({
                        userId: partnerId,
                        questionId
                    });

                    if (!existingPartnerAnswer) {
                        const dummyAnswers = [
                            "That's a really interesting question! I think...",
                            "I'd have to say yes to this one ❤️",
                            "For me, it's definitely about the little moments.",
                            "I love that you asked this!",
                            "My answer is: Absolutely!",
                            "Hmm, let me think... I'd choose the second option.",
                            "You know me so well! 😊",
                            "I was thinking the same thing!"
                        ];
                        const randomAnswer = dummyAnswers[Math.floor(Math.random() * dummyAnswers.length)];

                        await GameAnswer.create({
                            coupleId: user.coupleId,
                            questionId,
                            userId: partnerId,
                            text: randomAnswer,
                        });
                        console.log(`[DevMode] Auto-answered question ${questionId} for partner ${partnerId}`);
                    }
                } catch (err) {
                    console.error('[DevMode] Auto-answer error:', err);
                }
            }, 120000);
        }
    } catch (error) {
        console.error('Save game answer error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Get User's Answered Question IDs (Protected - For App)
// ------------------------------------------------------------------
const getUserAnswers = async (req, res) => {
    try {
        const userId = req.userId;

        const GameAnswer = require('../../models/GameAnswer');
        const answers = await GameAnswer.find({ userId }).select('questionId');

        const answeredQuestionIds = answers.map((a) => a.questionId.toString());

        res.json(
            successResponse({
                answeredQuestionIds,
                totalAnswered: answeredQuestionIds.length,
            })
        );
    } catch (error) {
        console.error('Get user answers error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    getGameCategories,
    getQuestionsByCategory,
    getRandomGame,
    saveAnswer,
    getUserAnswers,
};
