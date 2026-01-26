const mongoose = require('mongoose');
const GameCategory = require('../src/models/GameCategory');
require('dotenv').config();

const DEFAULT_IMAGE = 'https://raw.githubusercontent.com/ItsYash1421/Banners/main/Logo-Games-Category.png';

const updateGameImages = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log('Updating game categories...');
        const result = await GameCategory.updateMany(
            { $or: [{ image: { $exists: false } }, { image: null }, { image: '' }] },
            { $set: { image: DEFAULT_IMAGE } }
        );

        console.log(`Updated ${result.modifiedCount} categories with default image.`);

        // List all categories to verify
        const categories = await GameCategory.find({});
        console.log('Current Categories:', categories.map(c => ({ name: c.name, image: c.image })));

        await mongoose.disconnect();
        console.log('Disconnected');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

updateGameImages();
