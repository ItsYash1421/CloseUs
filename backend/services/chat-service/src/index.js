const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('@closeus/db/connection');
const chatRoutes = require('./routes/chatRoutes');
const { PORTS } = require('@closeus/constants');
const { verifyToken } = require('@closeus/utils');
const Message = require('./models/Message');
const Couple = require('./models/Couple');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || PORTS.CHAT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, service: 'chat-service', status: 'healthy' });
});

// Socket.io connection handling
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return next(new Error('Invalid token'));
        }

        socket.userId = decoded.userId;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Find user's couple and join couple room
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

    // Send message
    socket.on('send_message', async (data) => {
        try {
            const { type, content, metadata } = data;

            if (!socket.coupleId) {
                socket.emit('error', { message: 'Not part of a paired couple' });
                return;
            }

            // Save message to database
            const message = await Message.create({
                coupleId: socket.coupleId,
                senderId: socket.userId,
                type: type || 'text',
                content,
                metadata: metadata || {}
            });

            const populatedMessage = await Message.findById(message._id).populate('senderId', 'name');

            // Broadcast to couple room
            io.to(`couple_${socket.coupleId}`).emit('receive_message', populatedMessage);
        } catch (error) {
            console.error('Send message error:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Typing indicator
    socket.on('typing', () => {
        if (socket.coupleId) {
            socket.to(`couple_${socket.coupleId}`).emit('partner_typing', {
                userId: socket.userId
            });
        }
    });

    // Stop typing
    socket.on('stop_typing', () => {
        if (socket.coupleId) {
            socket.to(`couple_${socket.coupleId}`).emit('partner_stopped_typing', {
                userId: socket.userId
            });
        }
    });

    // Message read receipt
    socket.on('message_read', async (data) => {
        try {
            const { messageId } = data;
            await Message.findByIdAndUpdate(messageId, { isRead: true });

            if (socket.coupleId) {
                socket.to(`couple_${socket.coupleId}`).emit('message_read_update', { messageId });
            }
        } catch (error) {
            console.error('Message read error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
    });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`🚀 Chat Service with Socket.io running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start chat service:', error);
        process.exit(1);
    }
};

startServer();
