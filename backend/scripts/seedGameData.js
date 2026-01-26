const mongoose = require('mongoose');
require('dotenv').config();

// ------------------------------------------------------------------
// Models
// ------------------------------------------------------------------
const GameCategory = require('../src/models/GameCategory');
const GameQuestion = require('../src/models/GameQuestion');

// ------------------------------------------------------------------
// Seed Data: 5 Categories with 7 Questions Each
// ------------------------------------------------------------------
const categories = [
    {
        name: 'Getting to Know You',
        emoji: '💭',
        color: '#FF6B9D',
        tags: ['personal', 'deep', 'connection'],
        isTrending: true,
        order: 1,
        questions: [
            'What would be your perfect day from start to finish?',
            'If you could live anywhere in the world, where would it be and why?',
            'What is one thing you wish more people knew about you?',
            'What makes you feel most loved and appreciated?',
            'If you could have dinner with anyone (living or dead), who would it be?',
            'What childhood memory always makes you smile?',
            'What is your biggest dream in life?',
        ],
    },
    {
        name: 'Future Together',
        emoji: '🌟',
        color: '#FFD93D',
        tags: ['future', 'plans', 'dreams'],
        isTrending: true,
        order: 2,
        questions: [
            'Where do you see us in 5 years?',
            'What is one place you want us to travel to together?',
            'What kind of home would you like us to create together?',
            'What traditions would you like us to start as a couple?',
            'What is one goal you want us to achieve together?',
            'How do you imagine our perfect weekend together?',
            'What adventure would you like us to have together?',
        ],
    },
    {
        name: 'Love & Romance',
        emoji: '💖',
        color: '#FF4B91',
        tags: ['romance', 'love', 'feelings'],
        isTrending: false,
        order: 3,
        questions: [
            'What was the moment you realized you loved me?',
            'What is your favorite thing about our relationship?',
            'What is one romantic gesture that always melts your heart?',
            'How do you like to be surprised?',
            'What song reminds you of us and why?',
            'What is your idea of a perfect date night?',
            'What is your love language, and how can I speak it better?',
        ],
    },
    {
        name: 'Fun & Playful',
        emoji: '🎉',
        color: '#6BCF7F',
        tags: ['fun', 'lighthearted', 'playful'],
        isTrending: false,
        order: 4,
        questions: [
            'If we were in a movie, what genre would it be?',
            'What superpower would you choose and why?',
            'If you could swap lives with me for a day, what would you do?',
            'What is the funniest thing that ever happened to us?',
            'If we started a band, what would we name it?',
            'What is your guilty pleasure that you don\'t tell many people?',
            'If we won the lottery tomorrow, what is the first thing you would do?',
        ],
    },
    {
        name: 'Deep Conversations',
        emoji: '🌙',
        color: '#9B59B6',
        tags: ['deep', 'thoughtful', 'meaningful'],
        isTrending: false,
        order: 5,
        questions: [
            'What is your biggest fear in life?',
            'What is something you want to improve about yourself?',
            'What does happiness mean to you?',
            'If you could change one thing about your past, what would it be?',
            'What is one lesson life has taught you that you\'ll never forget?',
            'What motivates you to keep going when things get tough?',
            'What is your definition of a meaningful life?',
        ],
    },
];

// ------------------------------------------------------------------
// MongoDB Connection
// ------------------------------------------------------------------
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// ------------------------------------------------------------------
// Seed Function
// ------------------------------------------------------------------
const seedGameData = async () => {
    try {
        console.log('🌱 Starting Game Data Seeding...\n');

        // Clear existing data
        await GameCategory.deleteMany({});
        await GameQuestion.deleteMany({});
        console.log('🗑️  Cleared existing game data\n');

        // Create categories and questions
        for (const categoryData of categories) {
            const { questions, ...categoryInfo } = categoryData;

            // Create category
            const category = await GameCategory.create(categoryInfo);
            console.log(`✅ Created category: ${category.name} (${category.emoji})`);

            // Create questions for this category
            const questionDocs = questions.map((text, index) => ({
                categoryId: category._id,
                text,
                isActive: true,
                order: index + 1,
                timesPlayed: 0,
            }));

            await GameQuestion.insertMany(questionDocs);
            console.log(`   📝 Added ${questions.length} questions\n`);
        }

        console.log('✅ Game data seeding completed!\n');
        console.log('📊 Summary:');
        console.log(`   - Categories: ${categories.length}`);
        console.log(`   - Questions: ${categories.reduce((sum, c) => sum + c.questions.length, 0)}`);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        throw error;
    }
};

// ------------------------------------------------------------------
// Run Seeder
// ------------------------------------------------------------------
const runSeeder = async () => {
    await connectDB();
    await seedGameData();
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
};

// Execute
runSeeder();
