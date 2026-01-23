import apiClient from './apiClient';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface GameCategory {
    _id: string;
    gameType: 'never_have_i_ever' | 'would_you_rather' | 'who_more_likely';
    name: string;
    emoji: string;
    tags?: string[];
    color: string;
    isActive: boolean;
    isTrending: boolean;
    timesPlayed: number;
    questionCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface GameQuestion {
    _id: string;
    categoryId: string;
    text: string;
    isActive: boolean;
    order: number;
    timesPlayed: number;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryQuestionsResponse {
    category: {
        _id: string;
        name: string;
        emoji: string;
        gameType: string;
        color: string;
    };
    questions: GameQuestion[];
    totalQuestions: number;
}

export interface RandomGameResponse {
    question: {
        _id: string;
        text: string;
        timesPlayed: number;
    };
    category: {
        _id: string;
        name: string;
        emoji: string;
        gameType: string;
        color: string;
    };
}

// ------------------------------------------------------------------
// Games API Service
// ------------------------------------------------------------------
class GamesService {
    /**
     * Get all game categories
     */
    async getCategories(): Promise<GameCategory[]> {
        try {
            const response = await apiClient.get('/games/categories');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch game categories:', error);
            throw error;
        }
    }

    /**
     * Get questions by category ID
     */
    async getQuestionsByCategory(
        categoryId: string
    ): Promise<CategoryQuestionsResponse> {
        try {
            const response = await apiClient.get(`/games/questions/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch category questions:', error);
            throw error;
        }
    }

    /**
     * Get a random game question from all categories
     */
    async getRandomGame(): Promise<RandomGameResponse> {
        try {
            const response = await apiClient.get('/games/random-game');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch random game:', error);
            throw error;
        }
    }
}

export default new GamesService();
