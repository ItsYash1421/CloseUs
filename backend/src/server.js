require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const app = require('./app');
const { verifyToken } = require('./Shared/Utils');
const Message = require('./models/Message');
const Couple = require('./models/Couple');
const User = require('./models/User');

const PORT = process.env.PORT || 3000;

// ------------------------------------------------------------------
// Create HTTP server
// ------------------------------------------------------------------
const server = http.createServer(app);

// ------------------------------------------------------------------
// Initialize Socket.io
// ------------------------------------------------------------------
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// ------------------------------------------------------------------
// Socket Middleware
// ------------------------------------------------------------------
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error'));

        const decoded = verifyToken(token);
        if (!decoded) return next(new Error('Invalid token'));

        socket.userId = decoded.userId;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
});

// ------------------------------------------------------------------
// Socket Events
// ------------------------------------------------------------------
io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    const couple = await Couple.findOne({
        $or: [{ partner1Id: socket.userId }, { partner2Id: socket.userId }],
        isActive: true,
        isPaired: true,
    });

    if (couple) {
        const roomName = `couple_${couple._id}`;
        socket.join(roomName);
        socket.coupleId = couple._id.toString();
        console.log(`User ${socket.userId} joined room ${roomName}`);
    }

    socket.on('send_message', async (data) => {
        try {
            if (!socket.coupleId) {
                socket.emit('error', { message: 'Not part of a paired couple' });
                return;
            }

            const { type, content, metadata } = data;
            const message = await Message.create({
                coupleId: socket.coupleId,
                senderId: socket.userId,
                type: type || 'text',
                content,
                metadata: metadata || {},
            });

            const populatedMessage = await Message.findById(message._id).populate(
                'senderId',
                'name photoUrl'
            );
            io.to(`couple_${socket.coupleId}`).emit('receive_message', populatedMessage);

            try {
                const coupleForReply = await Couple.findById(socket.coupleId);
                if (coupleForReply) {
                    const partnerId =
                        coupleForReply.partner1Id.toString() === socket.userId
                            ? coupleForReply.partner2Id
                            : coupleForReply.partner1Id;

                    const partner = await User.findById(partnerId);

                    if (partner && partner.name === 'Dev Partner') {
                        const currentMinute = new Date().getMinutes();
                        const isOnline = Math.floor(currentMinute / 5) % 2 === 0;

                        if (isOnline) {
                            setTimeout(async () => {
                                try {
                                    await Message.findByIdAndUpdate(message._id, {
                                        isRead: true,
                                        readAt: new Date()
                                    });
                                    io.to(`couple_${socket.coupleId}`).emit('message_read', {
                                        messageId: message._id.toString()
                                    });
                                } catch (err) {
                                    console.error('Dev partner mark as read error:', err);
                                }
                            }, 500);

                           
                            setTimeout(async () => {
                                try {
                                    const reply = await Message.create({
                                        coupleId: socket.coupleId,
                                        senderId: partner._id,
                                        type: 'text',
                                        content: 'Working',
                                        metadata: {},
                                    });
                                    const populatedReply = await Message.findById(
                                        reply._id
                                    ).populate('senderId', 'name photoUrl');
                                    io.to(`couple_${socket.coupleId}`).emit(
                                        'receive_message',
                                        populatedReply
                                    );
                                    console.log('Sent auto-reply from Dev Partner');
                                } catch (err) {
                                    console.error('Auto-reply error:', err);
                                }
                            }, 1000);
                        }
                    }
                }
            } catch (err) {
                console.error('Check dev partner error:', err);
            }
        } catch (error) {
            console.error('Socket message error:', error);
        }
    });

    socket.on('typing', () => {
        if (socket.coupleId)
            socket
                .to(`couple_${socket.coupleId}`)
                .emit('partner_typing', { userId: socket.userId });
    });

    socket.on('stop_typing', () => {
        if (socket.coupleId)
            socket
                .to(`couple_${socket.coupleId}`)
                .emit('partner_stopped_typing', { userId: socket.userId });
    });

    socket.on('message_read', async (data) => {
        try {
            const { messageId } = data;
            const message = await Message.findByIdAndUpdate(
                messageId,
                { isRead: true, readAt: new Date() },
                { new: true }
            );
            
            if (message && socket.coupleId) {
                // Notify partner that message was read (no deletion yet)
                socket.to(`couple_${socket.coupleId}`).emit('message_read', { messageId });
            }
        } catch (error) {
            console.error('message_read error:', error);
        }
    });

    socket.on('chat_opened', async () => {
        try {
            if (!socket.coupleId) return;
            const couple = await Couple.findById(socket.coupleId);
            if (couple && couple.chatSettings && couple.chatSettings.deleteAfterSeen) {
                // Delete ALL old messages (regardless of read status) when chat opens
                // This clears any messages from previous modes (12-hour mode etc)
                const result = await Message.deleteMany({
                    coupleId: socket.coupleId
                });
                
                if (result.deletedCount > 0) {
                    // Notify both users to clear all messages
                    io.to(`couple_${socket.coupleId}`).emit('clear_chat');
                    console.log(`Deleted ${result.deletedCount} old messages on chat open (delete after seen mode)`);
                }
            }
        } catch (error) {
            console.error('chat_opened error:', error);
        }
    });

    socket.on('chat_closed', async () => {
        try {
            if (!socket.coupleId) return;
            
           
            const couple = await Couple.findById(socket.coupleId);
            if (couple && couple.chatSettings && couple.chatSettings.deleteAfterSeen) {
                
                setTimeout(async () => {
                    try {
                        const result = await Message.deleteMany({
                            coupleId: socket.coupleId,
                            isRead: true
                        });
                       
                        io.to(`couple_${socket.coupleId}`).emit('clear_read_messages');
                        console.log(`Deleted ${result.deletedCount} read messages after chat closed`);
                    } catch (err) {
                        console.error('Failed to delete messages after chat closed:', err);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('chat_closed error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.userId);
    });
});

// ------------------------------------------------------------------
// Start Server
// ------------------------------------------------------------------
const startServer = async () => {
    try {
        await connectDB();

        const initCronJobs = require('./App/Home/question.scheduler');
        initCronJobs();

        // Start Dev Partner Auto-Answer Scheduler (Dev Mode Only)
        const devPartnerScheduler = require('./App/Couple/partner.scheduler');
        devPartnerScheduler.start();

        // Start Message Cleanup Cron Job (runs every hour)
        const cleanupOldMessages = require('./Shared/messageCronJob');
        const cron = require('node-cron');
        
        // Run every hour
        cron.schedule('0 * * * *', () => {
            console.log('Running message cleanup cron job...');
            cleanupOldMessages();
        });
        
        // Run once on startup
        cleanupOldMessages();

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
