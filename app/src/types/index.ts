// User Types
export interface User {
    _id: string;
    email: string;
    googleId?: string;
    name: string;
    photoUrl?: string;
    dob?: Date;
    gender?: 'male' | 'female';
    relationshipStatus?: string;
    livingStyle?: string;
    anniversary?: Date;
    partnerName?: string;
    coupleId?: string;
    isOnboardingComplete: boolean;
    lastActive?: Date;
    fcmToken?: string;
    platform?: 'ios' | 'android';
    createdAt: Date;
    updatedAt: Date;
}

// Couple Types
export interface Couple {
    _id: string;
    partner1Id: string;
    partner2Id?: string;
    pairingKey?: string;
    pairingKeyExpires?: Date;
    isPaired: boolean;
    startDate?: Date;
    coupleTag?: string;
    relationshipStatus?: string;
    livingStyle?: string;
    timeZone?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CoupleStats {
    daysTogether: number;
    monthsTogether: number;
    yearsTogether: number;
    daysUntilAnniversary: number;
    totalMessages: number;
    questionsAnswered: number;
    gamesPlayed: number;
    memoriesCreated?: number;
    milestone?: {
        current: number;
        next: number;
        progress: number;
    };
}

// Message Types
export interface Message {
    _id: string;
    coupleId: string;
    senderId: string;
    type: 'text' | 'image' | 'voice' | 'gif';
    content: string;
    metadata?: {
        duration?: number;
        size?: number;
        mimeType?: string;
        thumbnailUrl?: string;
    };
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Question Types
export interface QuestionCategory {
    _id: string;
    name: string;
    emoji: string;
    description?: string;
    order: number;
    isActive: boolean;
}

export interface Question {
    _id: string;
    categoryId: string;
    text: string;
    isDaily: boolean;
    dailyDate?: Date;
    isActive: boolean;
    order: number;
    timesAnswered: number;
}

export interface Answer {
    _id: string;
    questionId: string;
    coupleId: string;
    userId: string;
    answer: string;
    createdAt: Date;
}

// Game Types
export interface Game {
    _id: string;
    type: 'never_have_i_ever' | 'would_you_rather' | 'who_more_likely';
    name: string;
    description?: string;
    emoji?: string;
    isActive: boolean;
    comingSoon: boolean;
}

export interface GameQuestion {
    _id: string;
    gameId: string;
    categoryId?: string;
    text: string;
    options?: string[];
    isActive: boolean;
}

export interface GameResponse {
    _id: string;
    gameId: string;
    questionId: string;
    coupleId: string;
    userId: string;
    response: string;
    createdAt: Date;
}

// Auth Types
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    user: User;
    tokens: AuthTokens;
}

// Navigation Types
export type RootStackParamList = {
    Splash: undefined;
    Welcome: undefined;
    Login: undefined;
    PersonalInfo: undefined;
    GenderSelection: undefined;
    RelationshipStatus: undefined;
    LivingStyle: undefined;
    Anniversary: undefined;
    CreateKey: undefined;
    EnterKey: undefined;
    PairingSuccess: undefined;
    MainTabs: undefined;
    Home: undefined;
    Chat: undefined;
    Questions: undefined;
    DailyQuestion: { questionId: string };
    AnswerReveal: { questionId: string };
    CategoryDetail: { categoryId: string };
    Games: undefined;
    NeverHaveIEver: { gameId: string };
    Profile: undefined;
    EditProfile: undefined;
    Settings: undefined;
};

export type TabParamList = {
    Home: undefined;
    Chat: undefined;
    Questions: undefined;
    Games: undefined;
    Profile: undefined;
};

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
}
