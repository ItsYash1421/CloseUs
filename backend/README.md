# CloseUs Backend - Microservices

A microservices-based backend for CloseUs couples app with MongoDB.

## Services

- **Auth Service** (Port 3001) - Google OAuth, JWT tokens
- **User Service** (Port 3002) - User profiles and onboarding
- **Couple Service** (Port 3003) - Pairing, couple management
- **Chat Service** (Port 3004) - Real-time messaging with Socket.io
- **Questions Service** (Port 3005) - Daily questions and categories
- **Games Service** (Port 3006) - Couple games
- **Media Service** (Port 3007) - File uploads
- **API Gateway** (Port 3000) - Request routing

## Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Set environment variables:
Create `.env` file in each service directory with:
```
MONGODB_URI=mongodb+srv://yashamanmeena1:J5emIcPwHS25hLhd@stayfinder-admin.qtfwbs2.mongodb.net/closeus
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

3. Run all services:
```bash
npm run dev
```

Or run individual services:
```bash
npm run dev:auth
npm run dev:user
npm run dev:couple
npm run dev:chat
```

## API Endpoints

### Auth Service (3001)
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/refresh` - Refresh access token
- `GET /auth/verify` - Verify token
- `POST /auth/logout` - Logout

### User Service (3002)
- `GET /users/me` - Get current user
- `PUT /users/me` - Update profile
- `GET /users/:id` - Get user by ID

### Couple Service (3003)
- `POST /couples/create-key` - Generate pairing key
- `POST /couples/pair` - Pair with partner
- `GET /couples/me` - Get couple info
- `PUT /couples/me` - Update couple
- `GET /couples/stats` - Get couple statistics

### Chat Service (3004)
- `GET /chat/messages` - Get message history
- `POST /chat/send` - Send message (HTTP fallback)
- `PUT /chat/read/:messageId` - Mark as read

**WebSocket Events:**
- `send_message` - Send real-time message
- `receive_message` - Receive message
- `typing` - Typing indicator
- `stop_typing` - Stop typing
- `message_read` - Message read receipt

## Architecture

Each service is independent with its own:
- Express server
- MongoDB models
- Controllers and routes
- Authentication middleware

Shared modules:
- `@closeus/db` - MongoDB connection
- `@closeus/utils` - Helper functions
- `@closeus/constants` - Shared constants
