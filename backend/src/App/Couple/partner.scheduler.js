const DailyCoupleQuestion = require('../../models/DailyCoupleQuestion');
const Answer = require('../../models/Answer');
const User = require('../../models/User');
const Couple = require('../../models/Couple');

// ------------------------------------------------------------------
// Dev Partner Auto-Answer Scheduler
// ------------------------------------------------------------------
class DevPartnerScheduler {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) {
            console.log('Dev Partner Scheduler is already running');
            return;
        }

        console.log('✅ Dev Partner Auto-Answer Scheduler started');
        this.isRunning = true;

        this.intervalId = setInterval(async () => {
            await this.processDevPartnerAnswers();
        }, 60 * 1000);

        this.processDevPartnerAnswers();
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isRunning = false;
            console.log('⏹️  Dev Partner Auto-Answer Scheduler stopped');
        }
    }

    async processDevPartnerAnswers() {
        try {
            const now = new Date();

            const delayTime = new Date(now.getTime() - 10 * 1000);

            const devCouples = await Couple.find({ isDevPartner: true, isPaired: true });

            for (const couple of devCouples) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const dailyQuestion = await DailyCoupleQuestion.findOne({
                    coupleId: couple._id,
                    date: today,
                });

                if (!dailyQuestion) continue;

                const partner1Answer = await Answer.findOne({
                    userId: couple.partner1Id,
                    questionId: dailyQuestion.questionId,
                    coupleId: couple._id,
                });

                const partner2Answer = await Answer.findOne({
                    userId: couple.partner2Id,
                    questionId: dailyQuestion.questionId,
                    coupleId: couple._id,
                });

                const partner1 = await User.findById(couple.partner1Id);
                const partner2 = await User.findById(couple.partner2Id);

                let realUser, devPartner, realUserAnswer, devPartnerAnswer;

                if (partner1.email.includes('@closeus.dev')) {
                    devPartner = partner1;
                    realUser = partner2;
                    devPartnerAnswer = partner1Answer;
                    realUserAnswer = partner2Answer;
                } else {
                    realUser = partner1;
                    devPartner = partner2;
                    realUserAnswer = partner1Answer;
                    devPartnerAnswer = partner2Answer;
                }

                if (realUserAnswer && !devPartnerAnswer) {
                    const answerTime = new Date(realUserAnswer.createdAt);
                    if (answerTime <= delayTime) {
                        await this.createDevPartnerAnswer(
                            devPartner._id,
                            dailyQuestion.questionId,
                            couple._id
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Dev Partner Scheduler error:', error);
        }
    }

    async createDevPartnerAnswer(userId, questionId, coupleId) {
        try {
            const responses = [
                'I love spending time with you! 💕',
                'You make me so happy every day! 😊',
                'Being with you is the best feeling! ❤️',
                "I'm grateful for every moment we share! 🌟",
                "You're amazing and I appreciate you! 💖",
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            await Answer.create({
                userId,
                questionId,
                coupleId,
                text: randomResponse,
                date: today,
            });

            console.log(`✅ Dev partner auto-answered for question ${questionId}`);
        } catch (error) {
            console.error('Create dev partner answer error:', error);
        }
    }
}

const devPartnerScheduler = new DevPartnerScheduler();
module.exports = devPartnerScheduler;
