import apiClient from './apiClient';
import { Message, ApiResponse, PaginatedResponse } from '../types';

class ChatService {
  // Get latest 10 messages for initial load
  async getRecentMessages(): Promise<Message[]> {
    const response = await apiClient.get<ApiResponse<{ messages: Message[] }>>(
      '/api/chat/messages/recent',
    );
    return (response.data as any).messages || [];
  }

  // Get older messages with cursor-based pagination
  async getOlderMessages(
    before: string,
    limit: number = 20,
  ): Promise<PaginatedResponse<Message>> {
    const response = await apiClient.get<
      ApiResponse<{ messages: Message[]; hasMore: boolean }>
    >(`/api/chat/messages/older?before=${before}&limit=${limit}`);

    const data = response.data as any;
    return {
      data: data.messages || [],
      page: 1,
      limit: limit,
      total: 0,
      hasMore: data.hasMore || false,
    };
  }

  async sendMessage(
    type: 'text' | 'image' | 'voice' | 'gif',
    content: string,
    metadata?: any,
  ): Promise<Message> {
    const response = await apiClient.post<ApiResponse<Message>>(
      '/api/chat/send',
      {
        type,
        content,
        metadata,
      },
    );
    return response.data!;
  }

  async markAsRead(messageId: string): Promise<void> {
    await apiClient.put(`/api/chat/read/${messageId}`);
  }

  async uploadImage(imageUri: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'chat-image.jpg',
    } as any);

    const response = await apiClient.upload<ApiResponse<{ url: string }>>(
      '/api/media/upload',
      formData,
    );
    return response.data!.url;
  }

  async uploadVoice(audioUri: string, duration: number): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'voice-message.m4a',
    } as any);
    formData.append('duration', duration.toString());

    const response = await apiClient.upload<ApiResponse<{ url: string }>>(
      '/api/media/upload',
      formData,
    );
    return response.data!.url;
  }

  async updateChatSettings(settings: {
    deleteAfterSeen?: boolean;
    deleteAfter12Hours?: boolean;
  }): Promise<{ deleteAfterSeen: boolean; deleteAfter12Hours: boolean }> {
    const response = await apiClient.put<
      ApiResponse<{ deleteAfterSeen: boolean; deleteAfter12Hours: boolean }>
    >('/api/chat/settings', settings);
    return response.data!;
  }

  async getChatSettings(): Promise<{
    deleteAfterSeen: boolean;
    deleteAfter12Hours: boolean;
  }> {
    const response =
      await apiClient.get<
        ApiResponse<{ deleteAfterSeen: boolean; deleteAfter12Hours: boolean }>
      >('/api/chat/settings');
    return response.data!;
  }

  async deleteMessage(messageId: string): Promise<void> {
    await apiClient.delete(`/api/chat/messages/${messageId}`);
  }

  async deleteAllMessages(): Promise<void> {
    await apiClient.delete('/api/chat/messages');
  }
}

export const chatService = new ChatService();
export default chatService;
