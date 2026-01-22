import apiClient from './apiClient';
import { ApiResponse } from '../types';

export interface QuestionData {
  id: string;
  text: string;
  category: string;
}

export interface AnswerData {
  text: string;
  createdAt: string;
  isLocked?: boolean;
}

export interface DailyQuestionResponse {
  question: QuestionData;
  myAnswer: AnswerData | null;
  partnerAnswer: AnswerData | null;
}

class QuestionService {
  /**
   * Get the daily question for today
   */
  async getDailyQuestion(): Promise<DailyQuestionResponse> {
    const response = await apiClient.get<ApiResponse<DailyQuestionResponse>>(
      '/api/users/questions/daily',
    );
    // Handle potential nested data structure if wrapper exists (apiClient usually handles one layer)
    // Adjusting based on standard ApiResponse pattern in this project
    return response.data!;
  }

  /**
   * Submit answer for a question
   */
  async answerQuestion(
    questionId: string,
    text: string,
  ): Promise<ApiResponse<AnswerData>> {
    const response = await apiClient.post<ApiResponse<AnswerData>>(
      `/api/users/questions/daily/${questionId}/answer`,
      {
        text,
      },
    );
    return response;
  }
}

export const questionService = new QuestionService();
export default questionService;
