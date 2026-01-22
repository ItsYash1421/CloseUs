module.exports = {
    // ------------------------------------------------------------------
    // Relationship Status
    // ------------------------------------------------------------------
    RELATIONSHIP_STATUS: {
        DATING: 'dating',
        ENGAGED: 'engaged',
        MARRIED: 'married',
        OTHER: 'other',
    },

    // ------------------------------------------------------------------
    // Living Style
    // ------------------------------------------------------------------
    LIVING_STYLE: {
        LONG_DISTANCE: 'long_distance',
        SAME_CITY: 'same_city',
        LIVING_TOGETHER: 'living_together',
    },

    // ------------------------------------------------------------------
    // Message Types
    // ------------------------------------------------------------------
    MESSAGE_TYPES: {
        TEXT: 'text',
        IMAGE: 'image',
        VOICE: 'voice',
        GIF: 'gif',
    },

    // ------------------------------------------------------------------
    // Game Types
    // ------------------------------------------------------------------
    GAME_TYPES: {
        NEVER_HAVE_I_EVER: 'never_have_i_ever',
        WOULD_YOU_RATHER: 'would_you_rather',
    },

    // ------------------------------------------------------------------
    // Media Types
    // ------------------------------------------------------------------
    MEDIA_TYPES: {
        PROFILE_PHOTO: 'profile_photo',
        GALLERY: 'gallery',
        CHAT_IMAGE: 'chat_image',
        CHAT_VOICE: 'chat_voice',
    },

    // ------------------------------------------------------------------
    // File Upload Limits
    // ------------------------------------------------------------------
    FILE_LIMITS: {
        MAX_IMAGE_SIZE: 5 * 1024 * 1024,
        MAX_VOICE_SIZE: 10 * 1024 * 1024,
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
        ALLOWED_VOICE_TYPES: ['audio/mpeg', 'audio/mp4', 'audio/webm'],
    },
};
