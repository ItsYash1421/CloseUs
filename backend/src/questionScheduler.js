const cron = require('node-cron');
const aiService = require('./services/aiService');
const Question = require('./models/Question');
const QuestionCategory = require('./models/QuestionCategory');

// Initialize Cron Jobs
const initCronJobs = () => {
    // Run at 00:00 (Midnight) every day
    cron.schedule('0 0 * * *', async () => {
        console.log('[Scheduler] Running Daily Question Generation...');
        try {
            // 0. CLEANUP: Delete questions older than 2 days (keep only today and yesterday)
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            twoDaysAgo.setHours(0, 0, 0, 0);

            const deleteResult = await Question.deleteMany({
                isDaily: true,
                isAiGenerated: true,
                createdAt: { $lt: twoDaysAgo }
            });

            if (deleteResult.deletedCount > 0) {
                console.log(`[Scheduler] 🗑️ Cleaned up ${deleteResult.deletedCount} old questions (older than 2 days)`);
            }

            // 1. Generate Questions via AI
            const questions = await aiService.generateQuestions(20);

            // 2. Get "Daily" Category ID (create if not exists)
            let dailyCategory = await QuestionCategory.findOne({ name: 'Daily' });
            if (!dailyCategory) {
                dailyCategory = await QuestionCategory.create({
                    name: 'Daily',
                    description: 'Daily AI generated questions',
                    emoji: '📅',
                    color: '#FF6B9D'
                });
            }

            // 3. Save to Database
            const operations = questions.map(text => ({
                insertOne: {
                    document: {
                        categoryId: dailyCategory._id,
                        text: text,
                        isDaily: true,
                        isActive: true,
                        isAiGenerated: true, // Tag as AI
                        createdAt: new Date()
                    }
                }
            }));

            if (operations.length > 0) {
                await Question.bulkWrite(operations);
                console.log(`[Scheduler] Successfully added ${operations.length} new AI questions.`);
            }

        } catch (error) {
            console.error('[Scheduler] Daily Question Generation Failed:', error);
        }
    });

    console.log('[Scheduler] Cron jobs initialized');
};

module.exports = initCronJobs;
