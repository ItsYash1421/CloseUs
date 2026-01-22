const Question = require('../../models/Question');
const Answer = require('../../models/Answer');
const DailyCoupleQuestion = require('../../models/DailyCoupleQuestion');
const User = require('../../models/User');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// Helper component to get today's date at midnight
const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

/**
 * Get Today's Daily Question
 * Logic:
 * 1. Check if couple already has a question assigned for today
 * 2. If yes, return it
 * 3. If no, pick a random active 'Daily' question that they haven't answered
 * 4. Assign it and return it
 */
const getDailyQuestion = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate('coupleId');

        if (!user || !user.coupleId) {
            return res.status(404).json(errorResponse('You must be in a couple to see daily questions', 404));
        }

        const coupleId = user.coupleId._id;
        const today = getTodayDate();

        // 1. Check existing assignment
        let assignedInfo = await DailyCoupleQuestion.findOne({
            coupleId: coupleId,
            date: today
        }).populate('questionId');

        // 2. Lazy Assign if missing
        if (!assignedInfo) {
            // Find IDs of questions already answered by this couple
            // (Strictly we should avoid questions assigned in the past even if unanswered, 
            // but checking answers is a good proxy for "consumed")
            // A better way is to exclude questions in DailyCoupleQuestion for this couple

            const usedQuestions = await DailyCoupleQuestion.find({ coupleId }).select('questionId');
            const usedIds = usedQuestions.map(dq => dq.questionId);

            // Fetch a random pool of available questions
            // Prefer AI generated ones (isDaily: true)
            const count = await Question.countDocuments({
                isDaily: true,
                isActive: true,
                _id: { $nin: usedIds }
            });

            if (count > 0) {
                const random = Math.floor(Math.random() * count);
                const randomQuestion = await Question.findOne({
                    isDaily: true,
                    isActive: true,
                    _id: { $nin: usedIds }
                }).skip(random);

                if (randomQuestion) {
                    assignedInfo = await DailyCoupleQuestion.create({
                        coupleId,
                        questionId: randomQuestion._id,
                        date: today
                    });
                    // Populate manually after create
                    assignedInfo.questionId = randomQuestion;
                }
            } else {
                // FALLBACK: If we ran out of unique questions, reuse an old one or a generic one
                // For now, let's just pick ANY daily question
                const anyQuestion = await Question.findOne({ isDaily: true, isActive: true });
                if (anyQuestion) {
                    assignedInfo = await DailyCoupleQuestion.create({
                        coupleId,
                        questionId: anyQuestion._id,
                        date: today
                    });
                    assignedInfo.questionId = anyQuestion;
                }
            }
        }

        if (!assignedInfo || !assignedInfo.questionId) {
            return res.status(404).json(errorResponse('No daily questions available right now', 404));
        }

        const question = assignedInfo.questionId;

        // 3. Get Answers (User's and Partner's)
        const myAnswer = await Answer.findOne({ questionId: question._id, userId });

        // Partner Answer logic
        const partnerId = user.coupleId.partner1Id.toString() === userId
            ? user.coupleId.partner2Id
            : user.coupleId.partner1Id;

        const partnerAnswer = await Answer.findOne({ questionId: question._id, userId: partnerId });

        res.json(successResponse({
            question: {
                id: question._id,
                text: question.text,
                category: 'Daily'
            },
            myAnswer: myAnswer ? {
                text: myAnswer.text,
                createdAt: myAnswer.createdAt
            } : null,
            partnerAnswer: partnerAnswer ? {
                isLocked: !myAnswer, // Hide partner answer until user answers
                text: myAnswer ? partnerAnswer.text : null, // Only show text if user answered
                createdAt: partnerAnswer.createdAt
            } : null
        }));

    } catch (error) {
        console.error('Get daily question error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Submit Answer to Daily Question
 */
const answerDailyQuestion = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params; // Question ID
        const { text } = req.body;

        if (!text) {
            return res.status(400).json(errorResponse('Answer text is required', 400));
        }

        const user = await User.findById(userId);
        if (!user || !user.coupleId) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        // Validate Question Exists
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json(errorResponse('Question not found', 404));
        }

        // Upsert Answer (Update if exists, else create)
        const today = getTodayDate();

        const answer = await Answer.findOneAndUpdate(
            {
                userId,
                questionId: id,
                coupleId: user.coupleId
            },
            {
                text,
                date: today
            },
            { new: true, upsert: true }
        );

        res.json(successResponse(answer, 'Answer submitted successfully'));

    } catch (error) {
        console.error('Answer question error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

//----------------------------------------------------//DEV//----------------------------------------------------//

/**
 * Delete Daily Answer (Dev/Test only)
 */
const deleteDailyAnswer = async (req, res) => {
    try {
        const userId = req.userId;
        let { id } = req.params; // Question ID or 'current'

        const user = await User.findById(userId);
        if (!user || !user.coupleId) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        // Handle 'current' to automatically find today's question
        if (id === 'current') {
            const today = getTodayDate();
            const dailyCoupleQuestion = await DailyCoupleQuestion.findOne({
                coupleId: user.coupleId,
                date: today
            });

            if (!dailyCoupleQuestion) {
                return res.status(404).json(errorResponse('No daily question assigned for today to delete answer for', 404));
            }
            id = dailyCoupleQuestion.questionId;
        }

        const result = await Answer.findOneAndDelete({
            userId,
            questionId: id,
            coupleId: user.coupleId
        });

        if (!result) {
            return res.status(404).json(errorResponse('Answer not found', 404));
        }

        res.json(successResponse(null, 'Answer deleted successfully'));

    } catch (error) {
        console.error('Delete answer error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    getDailyQuestion,
    answerDailyQuestion,
    deleteDailyAnswer
};
