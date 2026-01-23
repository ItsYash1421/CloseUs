require('dotenv').config();
const connectDB = require('../src/config/db');
const FeatureFlag = require('../src/models/FeatureFlag');
const Admin = require('../src/models/Admin');

// All app features with detailed configuration
const appFeatures = [
    // Core App Features
    {
        name: 'app_enabled',
        displayName: '🚀 App Enabled',
        description: 'Master switch to enable/disable entire application',
        isEnabled: true,
        rolloutPercentage: 100,
    },
    {
        name: 'maintenance_mode',
        displayName: '🔧 Maintenance Mode',
        description: 'Put app in maintenance mode with message to users',
        isEnabled: false,
        rolloutPercentage: 0,
    },

    // Screen Controls
    {
        name: 'chat_enabled',
        displayName: '💬 Chat Feature',
        description: 'Enable/disable chat functionality and messaging',
        isEnabled: true,
        rolloutPercentage: 100,
    },
    {
        name: 'games_enabled',
        displayName: '🎮 Games Section',
        description: 'Enable/disable games (Truth or Dare, Never Have I Ever, etc.)',
        isEnabled: true,
        rolloutPercentage: 100,
    },
    {
        name: 'questions_enabled',
        displayName: '❓ Daily Questions',
        description: 'Enable/disable daily questions feature',
        isEnabled: true,
        rolloutPercentage: 100,
    },
    {
        name: 'profile_enabled',
        displayName: '👤 Profile',
        description: 'Enable/disable user profile viewing and editing',
        isEnabled: true,
        rolloutPercentage: 100,
    },
    {
        name: 'couple_pairing',
        displayName: '❤️ Couple Pairing',
        description: 'Enable/disable couple pairing functionality',
        isEnabled: true,
        rolloutPercentage: 100,
    },

    // Functional Features
    {
        name: 'push_notifications',
        displayName: '🔔 Push Notifications',
        description: 'Enable/disable push notifications to users',
        isEnabled: true,
        rolloutPercentage: 100,
    },
    {
        name: 'profile_editing',
        displayName: '✏️ Profile Editing',
        description: 'Allow users to edit their profiles',
        isEnabled: true,
        rolloutPercentage: 100,
    },
    {
        name: 'media_upload',
        displayName: '📷 Media Upload',
        description: 'Enable media upload in chat (photos, videos)',
        isEnabled: true,
        rolloutPercentage: 100,
    },
    {
        name: 'voice_messages',
        displayName: '🎤 Voice Messages',
        description: 'Enable voice message recording in chat',
        isEnabled: true,
        rolloutPercentage: 100,
    },

    // Promotional Features
    {
        name: 'promotions_enabled',
        displayName: '🎁 Promotions',
        description: 'Enable/disable promotional codes and offers',
        isEnabled: true,
        rolloutPercentage: 100,
    },
    {
        name: 'campaigns_enabled',
        displayName: '📣 Campaigns',
        description: 'Enable/disable marketing campaigns',
        isEnabled: true,
        rolloutPercentage: 100,
    },

    // New Features (Beta)
    {
        name: 'stories_feature',
        displayName: '📸 Stories (Beta)',
        description: 'Enable/disable stories feature for couples',
        isEnabled: false,
        rolloutPercentage: 0,
    },
    {
        name: 'video_call',
        displayName: '📹 Video Call (Beta)',
        description: 'Enable/disable video calling feature',
        isEnabled: false,
        rolloutPercentage: 0,
    },
    {
        name: 'moments_gallery',
        displayName: '🖼️ Moments Gallery',
        description: 'Enable/disable shared moments/photos gallery',
        isEnabled: false,
        rolloutPercentage: 0,
    },

    // Advanced Features
    {
        name: 'ai_suggestions',
        displayName: '🤖 AI Suggestions',
        description: 'AI-powered conversation starters and suggestions',
        isEnabled: false,
        rolloutPercentage: 0,
    },
    {
        name: 'analytics_tracking',
        displayName: '📊 Analytics Tracking',
        description: 'Track user behavior and app analytics',
        isEnabled: true,
        rolloutPercentage: 100,
    },
];

const seedFeatureFlags = async () => {
    try {
        await connectDB();

        // Find first admin to set as creator
        const admin = await Admin.findOne();
        if (!admin) {
            console.log('⚠️  No admin found. Please run seed:admin first.');
            process.exit(1);
        }

        console.log('🌱 Seeding feature flags...\n');

        for (const feature of appFeatures) {
            const existing = await FeatureFlag.findOne({ name: feature.name });

            if (existing) {
                console.log(`⏭️  ${feature.displayName} - Already exists`);
            } else {
                await FeatureFlag.create({
                    ...feature,
                    createdBy: admin._id,
                });
                console.log(`✅ ${feature.displayName} - Created`);
            }
        }

        console.log('\n🎉 Feature flags seeded successfully!');
        console.log(`📊 Total features: ${appFeatures.length}`);

        const featureCounts = {
            core: appFeatures.filter(f => ['app_enabled', 'maintenance_mode'].includes(f.name)).length,
            screens: appFeatures.filter(f => f.name.endsWith('_enabled') && !['app_enabled', 'promotions_enabled', 'campaigns_enabled'].includes(f.name)).length,
            functional: appFeatures.filter(f => ['push_notifications', 'profile_editing', 'media_upload', 'voice_messages'].includes(f.name)).length,
            promotional: appFeatures.filter(f => ['promotions_enabled', 'campaigns_enabled'].includes(f.name)).length,
            beta: appFeatures.filter(f => f.rolloutPercentage === 0 && !f.name.includes('maintenance')).length,
        };

        console.log(`\n📦 Core Features: ${featureCounts.core}`);
        console.log(`📱 Screen Controls: ${featureCounts.screens}`);
        console.log(`⚙️  Functional Features: ${featureCounts.functional}`);
        console.log(`🎁 Promotional: ${featureCounts.promotional}`);
        console.log(`🧪 Beta Features: ${featureCounts.beta}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding feature flags:', error);
        process.exit(1);
    }
};

seedFeatureFlags();
