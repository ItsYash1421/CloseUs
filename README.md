# CloseUs - Couples App

**A private, beautiful space for couples to connect, bond, and grow together.**

## Project Overview

CloseUs is a mobile application built for couples with:
- Private pairing system with unique keys
- Real-time encrypted chat
- Daily bonding questions
- Couple games
- Shared memories and statistics

## Architecture

### Backend (Microservices)
```
backend/
├── api-gateway/           (Port 3000)
├── services/
│   ├── auth-service/     (Port 3001) - Google OAuth, JWT
│   ├── user-service/     (Port 3002) - User profiles
│   ├── couple-service/   (Port 3003) - Pairing logic
│   ├── chat-service/     (Port 3004) - Real-time chat
│   ├── questions-service/ (Port 3005)
│   ├── games-service/    (Port 3006)
│   └── media-service/    (Port 3007)
└── shared/               - DB, utils, constants
```

### Mobile (React Native CLI)
```
mobile/
└── src/
    ├── components/       - Reusable UI components
    ├── screens/          - Screen components
    ├── services/         - API integration
    ├── store/            - State management
    ├── constants/        - Design system
    └── assets/           - Images, fonts
```

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB (Atlas)
- Socket.io (real-time)
- JWT authentication
- Google OAuth 2.0

**Mobile:**
- React Native CLI (TypeScript)
- React Navigation
- Zustand (state)
- Socket.io Client
- Axios

## Getting Started

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm run install:all
```

3. Configure environment variables (in each service):
```
MONGODB_URI=mongodb+srv://yashamanmeena1:
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Run all services:
```bash
npm run dev
```

Or run individual services:
```bash
npm run dev:auth
npm run dev:couple
npm run dev:chat
```

### Mobile Setup

1. Navigate to mobile:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS pods:
```bash
cd ios && pod install && cd ..
```

4. Run app:
```bash
# iOS
npm run ios

# Android
npm run android
```

## Key Features

### 1. Pairing System
- User A creates unique 6-character key
- User B enters key to pair
- Auto-generates couple tag (e.g., `#Yasushi`)

### 2. Real-time Chat
- Text messages
- Image sharing
- Voice notes
- GIF support
- Typing indicators
- Read receipts

### 3. Daily Questions
- New question every 24 hours
- Category-based questions
- Both must answer to unlock responses
- Progress tracking

### 4. Couple Games
- Never Have I Ever
- Would You Rather (coming soon)
- Category-based gameplay
- Completion tracking

### 5. Profile & Stats
- Time together (years, months, days)
- Anniversary countdown
- Photo gallery
- Relationship milestones

## Development Workflow

1. **Planning** - Implementation plan approved ✅
2. **Backend** - Microservices built ✅
3. **Mobile** - Foundation setup ✅
4. **Implementation** - Screens & features (in progress)
5. **Testing** - iOS & Android testing
6. **Deployment** - App Store & Play Store

## Project Status

✅ Backend microservices architecture
✅ MongoDB connection
✅ Auth service (Google OAuth + JWT)
✅ User service (profile management)
✅ Couple service (pairing logic)
✅ Chat service (Socket.io)
✅ React Native project initialized
✅ Design system (Colors, Fonts, Layout)
✅ API services (auth, user, couple)

🚧 In Progress:
- UI components
- Screen implementations
- Navigation setup
- State management

## Next Steps

1. Complete essential UI components (Button, Card, Input)
2. Implement authentication screens
3. Build onboarding flow
4. Create pairing screens
5. Implement chat UI
6. Add navigation
7. Polish animations

## Documentation

- [Backend README](./backend/README.md)
- [Mobile README](./mobile/README.md)
- [Implementation Plan](.gemini/antigravity/brain/.../implementation_plan.md)
- [UI Reference](.gemini/antigravity/brain/.../ui_reference.md)

## Database

**MongoDB Atlas Connection:**

Configured via `.env` file in backend folder. See [backend/.env.example](./backend/.env.example) for setup.

**Collections:**
- users
- couples
- messages
- questions
- answers
- games
- media
- feedback

## License

Private - CloseUs Team

---

**Built with ❤️ for couples who want to stay close**
