// API Environments
export const ENV_CONFIG = {
    PROD: 'https://api.closeus.com', // TODO: Update with actual PROD URL
    PRE_PROD: 'https://staging-api.closeus.com', // TODO: Update with actual PRE-PROD URL
    REMOTE_DEV: 'http://172.20.10.4:3000', // Your local machine IP for device testing
    LOCAL: 'http://localhost:3000', // Simulator/Emulator only
};

// Current API Configuration
// Change this to switch environments: ENV_CONFIG.PROD | ENV_CONFIG.PRE_PROD | ENV_CONFIG.REMOTE_DEV
export const API_BASE_URL = ENV_CONFIG.REMOTE_DEV;
export const SOCKET_URL = ENV_CONFIG.REMOTE_DEV;

// Google OAuth - Web Client ID from Firebase Console
// This is used for both iOS and Android (client_type: 3 from google-services.json)
export const GOOGLE_WEB_CLIENT_ID = '679581555584-5b3cqif6kg6th684lm2ijnp330c7950k.apps.googleusercontent.com';

// Deprecated: Use GOOGLE_WEB_CLIENT_ID instead
export const GOOGLE_CLIENT_ID_IOS = GOOGLE_WEB_CLIENT_ID;
export const GOOGLE_CLIENT_ID_ANDROID = GOOGLE_WEB_CLIENT_ID;

// App Configuration
export const APP_NAME = 'CloseUs';
export const APP_VERSION = '1.0.0';

// Feature Flags
export const ENABLE_VOICE_MESSAGES = true;
export const ENABLE_GIF_PICKER = true;
export const ENABLE_PUSH_NOTIFICATIONS = true;
