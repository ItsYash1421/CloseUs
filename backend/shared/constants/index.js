module.exports = {
    // Server Ports
    PORTS: {
        GATEWAY: 3000,
        AUTH: 3001,
        USER: 3002,
        COUPLE: 3003,
        CHAT: 3004,
        QUESTIONS: 3005,
        GAMES: 3006,
        MEDIA: 3007
    },

    // Service URLs
    SERVICES: {
        AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
        USER: process.env.USER_SERVICE_URL || 'http://localhost:3002',
        COUPLE: process.env.COUPLE_SERVICE_URL || 'http://localhost:3003',
        CHAT: process.env.CHAT_SERVICE_URL || 'http://localhost:3004',
        QUESTIONS: process.env.QUESTIONS_SERVICE_URL || 'http://localhost:3005',
        GAMES: process.env.GAMES_SERVICE_URL || 'http://localhost:3006',
        MEDIA: process.env.MEDIA_SERVICE_URL || 'http://localhost:3007'
    },

    // JWT Settings
    JWT: {
        SECRET: process.env.JWT_SECRET || 'closeus-super-secret-key-change-in-production',
        EXPIRES_IN: '15m',
        REFRESH_EXPIRES_IN: '7d'
    },

    // Google OAuth
    GOOGLE: {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
        CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
        CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback'
    },

    // Relationship Status
    RELATIONSHIP_STATUS: {
        DATING: 'dating',
        ENGAGED: 'engaged',
        MARRIED: 'married',
        OTHER: 'other'
    },

    // Living Style
    LIVING_STYLE: {
        LONG_DISTANCE: 'long_distance',
        SAME_CITY: 'same_city',
        LIVING_TOGETHER: 'living_together'
    },

    // Message Types
    MESSAGE_TYPES: {
        TEXT: 'text',
        IMAGE: 'image',
        VOICE: 'voice',
        GIF: 'gif'
    },

    // Game Types
    GAME_TYPES: {
        NEVER_HAVE_I_EVER: 'never_have_i_ever',
        WOULD_YOU_RATHER: 'would_you_rather'
    },

    // Media Types
    MEDIA_TYPES: {
        PROFILE_PHOTO: 'profile_photo',
        GALLERY: 'gallery',
        CHAT_IMAGE: 'chat_image',
        CHAT_VOICE: 'chat_voice'
    },

    // File Upload Limits
    FILE_LIMITS: {
        MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
        MAX_VOICE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
        ALLOWED_VOICE_TYPES: ['audio/mpeg', 'audio/mp4', 'audio/webm']
    }
};
