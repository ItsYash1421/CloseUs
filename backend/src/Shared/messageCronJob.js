const Message = require('../models/Message');
const Couple = require('../models/Couple');

/**
 * Delete messages that are older than 12 hours
 * Run this every hour via cron job
 */
const cleanupOldMessages = async () => {
    try {
        console.log('Starting 12-hour message cleanup...');

        const couplesWithAutoDelete = await Couple.find({
            'chatSettings.deleteAfter12Hours': true,
            isPaired: true,
            isActive: true,
        });

        if (couplesWithAutoDelete.length === 0) {
            console.log('No couples have 12-hour auto-delete enabled');
            return;
        }

        const coupleIds = couplesWithAutoDelete.map((c) => c._id);

        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

        const result = await Message.deleteMany({
            coupleId: { $in: coupleIds },
            createdAt: { $lt: twelveHoursAgo },
        });

        console.log(`Deleted ${result.deletedCount} messages older than 12 hours`);
    } catch (error) {
        console.error('Error in cleanup job:', error);
    }
};

module.exports = cleanupOldMessages;
