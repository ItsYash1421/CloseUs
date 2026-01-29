
require('dotenv').config();
const mongoose = require('mongoose');
const GameCategory = require('../src/models/GameCategory');

const updateCategory = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the first active category
        const category = await GameCategory.findOne({ isActive: true });

        if (!category) {
            console.log('No active category found.');
            process.exit(0);
        }

        console.log(`Found category: ${category.name}`);
        console.log(`Current totalPlayed: ${category.totalPlayed}`);

        // Update totalPlayed to 5
        category.totalPlayed = 5;
        await category.save();

        console.log(`Updated totalPlayed to 5 for category: ${category.name}`);

        process.exit(0);
    } catch (error) {
        console.error('Error updating category:', error);
        process.exit(1);
    }
};

updateCategory();
