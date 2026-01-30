import apiClient from './apiClient';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface GameCategory {
  _id: string;
  gameType: 'never_have_i_ever' | 'would_you_rather' | 'who_more_likely';
  name: string;
  emoji: string;
  image?: string;
  tags?: string[];
  color: string;
  isActive: boolean;
  isTrending: boolean;
  totalPlayed: number;
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
  isAnsweredByUser: boolean;
  isAnsweredByPartner: boolean;
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
  stats: {
    totalQuestions: number;
    userAnsweredCount: number;
    partnerAnsweredCount: number;
    bothAnsweredCount: number;
  };
}

export interface RandomGameResponse {
  question: {
    _id: string;
    text: string;
  };
  category: {
    _id: string;
    name: string;
    emoji: string;
    gameType: string;
    color: string;
  };
}

export interface QuestionWithAnswersResponse {
  question: {
    _id: string;
    text: string;
    categoryId: string;
  };
  category: {
    _id: string;
    name: string;
    emoji: string;
    gameType: string;
    color: string;
  };
  userAnswer: {
    answer: string;
    answeredAt: string;
  } | null;
  partnerAnswer: {
    answer: string;
    answeredAt: string;
  } | null;
}

// ------------------------------------------------------------------
// Games API Service
// ------------------------------------------------------------------

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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
      const response = await apiClient.get<ApiResponse<GameCategory[]>>(
        '/api/games/categories',
      );
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
    categoryId: string,
  ): Promise<CategoryQuestionsResponse> {
    try {
      const response = await apiClient.get<
        ApiResponse<CategoryQuestionsResponse>
      >(`/api/games/questions/${categoryId}`);
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
      const response = await apiClient.get<ApiResponse<RandomGameResponse>>(
        '/api/games/random-game',
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch random game:', error);
      throw error;
    }
  }

  /**
   * Save answer for a game question
   */
  async saveAnswer(questionId: string, answer: string): Promise<void> {
    try {
      await apiClient.post('/api/games/answer', {
        questionId,
        answer,
      });
    } catch (error) {
      console.error('Failed to save answer:', error);
      throw error;
    }
  }

  /**
   * Get user's answered question IDs
   */
  async getUserAnswers(): Promise<{
    answeredQuestionIds: string[];
    totalAnswered: number;
  }> {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          answeredQuestionIds: string[];
          totalAnswered: number;
        }>
      >('/api/games/answers');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user answers:', error);
      throw error;
    }
  }

  /**
   * Get question with both user and partner answers
   */
  async getQuestionWithAnswers(
    questionId: string,
  ): Promise<QuestionWithAnswersResponse> {
    try {
      const response = await apiClient.get<
        ApiResponse<QuestionWithAnswersResponse>
      >(`/api/games/question/${questionId}/answers`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch question with answers:', error);
      throw error;
    }
  }
}

export default new GamesService();
