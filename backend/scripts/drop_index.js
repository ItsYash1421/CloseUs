require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const dropIndex = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const collection = mongoose.connection.collection('couples');

        console.log('Dropping index: coupleTag_1...');
        try {
            await collection.dropIndex('coupleTag_1');
            console.log('Index coupleTag_1 dropped successfully.');
        } catch (err) {
            if (err.codeName === 'IndexNotFound') {
                console.log('Index coupleTag_1 does not exist, skipping.');
            } else {
                console.error('Error dropping index:', err);
            }
        }

    } catch (error) {
        console.error('Script error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    }
};

dropIndex();
