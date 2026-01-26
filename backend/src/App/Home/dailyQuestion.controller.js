const Question = require('../../models/Question');
const Answer = require('../../models/Answer');
const DailyCoupleQuestion = require('../../models/DailyCoupleQuestion');
const User = require('../../models/User');
const { successResponse, errorResponse } = require('../../Shared/Utils');

const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

// ------------------------------------------------------------------
// Get Today's Daily Question
// ------------------------------------------------------------------
const getDailyQuestion = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate('coupleId');

        if (!user || !user.coupleId) {
            return res
                .status(404)
                .json(errorResponse('You must be in a couple to see daily questions', 404));
        }

        const coupleId = user.coupleId._id;
        const today = getTodayDate();

        let assignedInfo = await DailyCoupleQuestion.findOne({
            coupleId: coupleId,
            date: today,
        }).populate('questionId');

        if (!assignedInfo) {
            const usedQuestions = await DailyCoupleQuestion.find({ coupleId }).select('questionId');
            const usedIds = usedQuestions.map((dq) => dq.questionId);

            const count = await Question.countDocuments({
                isDaily: true,
                isActive: true,
                _id: { $nin: usedIds },
            });

            if (count > 0) {
                const random = Math.floor(Math.random() * count);
                const randomQuestion = await Question.findOne({
                    isDaily: true,
                    isActive: true,
                    _id: { $nin: usedIds },
                }).skip(random);

                if (randomQuestion) {
                    assignedInfo = await DailyCoupleQuestion.create({
                        coupleId,
                        questionId: randomQuestion._id,
                        date: today,
                    });

                    assignedInfo.questionId = randomQuestion;
                }
            } else {
                const anyQuestion = await Question.findOne({ isDaily: true, isActive: true });
                if (anyQuestion) {
                    assignedInfo = await DailyCoupleQuestion.create({
                        coupleId,
                        questionId: anyQuestion._id,
                        date: today,
                    });
                    assignedInfo.questionId = anyQuestion;
                }
            }
        }

        if (!assignedInfo || !assignedInfo.questionId) {
            return res
                .status(404)
                .json(errorResponse('No daily questions available right now', 404));
        }

        const question = assignedInfo.questionId;

        const myAnswer = await Answer.findOne({ questionId: question._id, userId });

        const partnerId =
            user.coupleId.partner1Id.toString() === userId
                ? user.coupleId.partner2Id
                : user.coupleId.partner1Id;

        const partnerAnswer = await Answer.findOne({ questionId: question._id, userId: partnerId });

        res.json(
            successResponse({
                question: {
                    id: question._id,
                    text: question.text,
                    category: 'Daily',
                },
                myAnswer: myAnswer
                    ? {
                        text: myAnswer.text,
                        createdAt: myAnswer.createdAt,
                    }
                    : null,
                partnerAnswer: partnerAnswer
                    ? {
                        isLocked: !myAnswer, // Hide partner answer until user answers
                        text: myAnswer ? partnerAnswer.text : null, // Only show text if user answered
                        createdAt: partnerAnswer.createdAt,
                    }
                    : null,
            })
        );
    } catch (error) {
        console.error('Get daily question error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

// ------------------------------------------------------------------
// Submit Answer
// ------------------------------------------------------------------
const answerDailyQuestion = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json(errorResponse('Answer text is required', 400));
        }

        const user = await User.findById(userId);
        if (!user || !user.coupleId) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json(errorResponse('Question not found', 404));
        }

        const today = getTodayDate();

        const answer = await Answer.findOneAndUpdate(
            {
                userId,
                questionId: id,
                coupleId: user.coupleId,
            },
            {
                text,
                date: today,
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

// ------------------------------------------------------------------
// Delete Daily Answer (Dev/Test)
// ------------------------------------------------------------------
const deleteDailyAnswer = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user || !user.coupleId) {
            return res.status(404).json(errorResponse('Couple not found', 404));
        }

        if (id === 'current') {
            const today = getTodayDate();
            const dailyCoupleQuestion = await DailyCoupleQuestion.findOne({
                coupleId: user.coupleId,
                date: today,
            });

            if (!dailyCoupleQuestion) {
                return res
                    .status(404)
                    .json(
                        errorResponse(
                            'No daily question assigned for today to delete answer for',
                            404
                        )
                    );
            }
            id = dailyCoupleQuestion.questionId;
        }

        const result = await Answer.findOneAndDelete({
            userId,
            questionId: id,
            coupleId: user.coupleId,
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
    deleteDailyAnswer,
};
