// Script to drop the old pairingKey index and let Mongoose recreate it with sparse: true
const mongoose = require('mongoose');
require('dotenv').config();

async function dropIndex() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('couples');

        // Drop the old index
        try {
            await collection.dropIndex('pairingKey_1');
            console.log('✅ Dropped old pairingKey_1 index');
        } catch (err) {
            if (err.code === 27) {
                console.log('Index already dropped or does not exist');
            } else {
                throw err;
            }
        }

        console.log('✅ Index fix complete. Restart your server to recreate the sparse index.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

dropIndex();
