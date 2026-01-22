require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../src/models/Question');

const cleanupOldQuestions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Delete questions older than 2 days
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        twoDaysAgo.setHours(0, 0, 0, 0);

        console.log(`🗑️ Deleting questions created before: ${twoDaysAgo.toISOString()}`);

        const result = await Question.deleteMany({
            isDaily: true,
            isAiGenerated: true,
            createdAt: { $lt: twoDaysAgo },
        });

        console.log(`✅ Deleted ${result.deletedCount} old questions`);

        // Show remaining questions
        const remaining = await Question.countDocuments({ isDaily: true });
        console.log(`📊 Remaining daily questions: ${remaining}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    }
};

cleanupOldQuestions();
