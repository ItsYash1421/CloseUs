require('dotenv').config();
const mongoose = require('mongoose');
const aiService = require('../src/services/aiService');
const Question = require('../src/models/Question');
const QuestionCategory = require('../src/models/QuestionCategory');

const seedDailyQuestions = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Create/Get Daily Category
        let dailyCategory = await QuestionCategory.findOne({ name: 'Daily' });
        if (!dailyCategory) {
            dailyCategory = await QuestionCategory.create({
                name: 'Daily',
                description: 'Daily AI generated questions',
                emoji: '📅',
                color: '#FF6B9D',
                order: 0
            });
            console.log('✅ Created Daily category');
        } else {
            console.log('✅ Daily category already exists');
        }

        // 2. Check if we already have daily questions
        const existingCount = await Question.countDocuments({ isDaily: true });
        console.log(`📊 Found ${existingCount} existing daily questions`);

        if (existingCount < 20) {
            console.log('🤖 Generating questions via AI...');
            const questions = await aiService.generateQuestions(20);

            // 3. Save to Database
            const operations = questions.map(text => ({
                insertOne: {
                    document: {
                        categoryId: dailyCategory._id,
                        text: text,
                        isDaily: true,
                        isActive: true,
                        isAiGenerated: true,
                        createdAt: new Date()
                    }
                }
            }));

            if (operations.length > 0) {
                await Question.bulkWrite(operations);
                console.log(`✅ Successfully added ${operations.length} new AI questions.`);
            }
        } else {
            console.log('✅ Already have enough daily questions, skipping generation');
        }

        // 4. Show summary
        const totalDaily = await Question.countDocuments({ isDaily: true });
        console.log(`\n📊 Total daily questions in database: ${totalDaily}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
};

seedDailyQuestions();
