require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const app = require('./app');
const { verifyToken } = require('./utils');
const Message = require('./models/Message');
const Couple = require('./models/Couple');
const User = require('./models/User');

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Socket Middleware
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

// Socket Events
io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join couple room
    const couple = await Couple.findOne({
        $or: [{ partner1Id: socket.userId }, { partner2Id: socket.userId }],
        isActive: true,
        isPaired: true
    });

    if (couple) {
        const roomName = `couple_${couple._id}`;
        socket.join(roomName);
        socket.coupleId = couple._id.toString();
        console.log(`User ${socket.userId} joined room ${roomName}`);
    }

    // Handle messages
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
                metadata: metadata || {}
            });

            const populatedMessage = await Message.findById(message._id).populate('senderId', 'name photoUrl');
            io.to(`couple_${socket.coupleId}`).emit('receive_message', populatedMessage);

            // AUTO-REPLY LOGIC FOR DEV PARTNER
            try {
                // Find the couple again to be sure of partners (or use cached if reliable, but safe to fetch or check IDs)
                const coupleForReply = await Couple.findById(socket.coupleId);
                if (coupleForReply) {
                    const partnerId = coupleForReply.partner1Id.toString() === socket.userId
                        ? coupleForReply.partner2Id
                        : coupleForReply.partner1Id;

                    const partner = await User.findById(partnerId);

                    if (partner && partner.name === 'Dev Partner') {
                        // Check if online (0-5, 10-15, etc.)
                        const currentMinute = new Date().getMinutes();
                        const isOnline = Math.floor(currentMinute / 5) % 2 === 0;

                        if (isOnline) {
                            // Send reply
                            setTimeout(async () => {
                                try {
                                    const reply = await Message.create({
                                        coupleId: socket.coupleId,
                                        senderId: partner._id,
                                        type: 'text',
                                        content: 'Working',
                                        metadata: {}
                                    });
                                    const populatedReply = await Message.findById(reply._id).populate('senderId', 'name photoUrl');
                                    io.to(`couple_${socket.coupleId}`).emit('receive_message', populatedReply);
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

    // Typing matching
    socket.on('typing', () => {
        if (socket.coupleId) socket.to(`couple_${socket.coupleId}`).emit('partner_typing', { userId: socket.userId });
    });

    socket.on('stop_typing', () => {
        if (socket.coupleId) socket.to(`couple_${socket.coupleId}`).emit('partner_stopped_typing', { userId: socket.userId });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.userId);
    });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
