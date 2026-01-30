import { Platform } from 'react-native';

// Change the font families here to update specific parts of the app
export const FONTS = {
    // --- BASE FONTS ---
    default: Platform.select({ ios: 'System', android: 'sans-serif' }),
    bold: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    medium: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    light: Platform.select({ ios: 'System', android: 'sans-serif-light' }),
    serif: Platform.select({ ios: 'Georgia', android: 'serif' }),
    mono: Platform.select({ ios: 'Courier', android: 'monospace' }),

    // --- GLOBAL UI ELEMENTS ---
    buttons: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    inputs: Platform.select({ ios: 'System', android: 'sans-serif' }),
    tabs: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    headers: Platform.select({ ios: 'System', android: 'sans-serif-medium' }), // Screen titles

    // --- LEGACY COMPATIBILITY (Temporary, will be replaced) ---
    questions: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    hashtags: Platform.select({ ios: 'Courier', android: 'monospace' }),
    quotes: Platform.select({ ios: 'Georgia', android: 'serif' }),
    names: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    body: Platform.select({ ios: 'System', android: 'sans-serif' }),
    thin: Platform.select({ ios: 'System', android: 'sans-serif-light' }),

    // --- FEATURE SPECIFIC ---

    home: {
        greeting: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        date: Platform.select({ ios: 'System', android: 'sans-serif' }),
        cardTitle: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        cardBody: Platform.select({ ios: 'System', android: 'sans-serif' }),
        dailyQuestion: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    },

    chat: {
        messageBody: Platform.select({ ios: 'System', android: 'sans-serif' }),
        timestamp: Platform.select({ ios: 'System', android: 'sans-serif-light' }),
        headerTitle: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        input: Platform.select({ ios: 'System', android: 'sans-serif' }),
    },

    profile: {
        name: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        email: Platform.select({ ios: 'System', android: 'sans-serif' }),
        statValue: Platform.select({ ios: 'System', android: 'sans-serif-bold' }), // Android equivalent?
        statLabel: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        menuItem: Platform.select({ ios: 'System', android: 'sans-serif' }),
    },

    onboarding: {
        title: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        subtitle: Platform.select({ ios: 'System', android: 'sans-serif' }),
        button: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    },

    games: {
        question: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        answer: Platform.select({ ios: 'System', android: 'sans-serif' }),
        timer: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        stats: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    },

    pairing: {
        code: Platform.select({ ios: 'Courier', android: 'monospace' }),
        instruction: Platform.select({ ios: 'System', android: 'sans-serif' }),
        title: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    },

    auth: {
        title: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        label: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        input: Platform.select({ ios: 'System', android: 'sans-serif' }),
        button: Platform.select({ ios: 'System', android: 'sans-serif-bold' }),
    }
};
