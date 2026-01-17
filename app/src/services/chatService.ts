import apiClient from './apiClient';
import { Message, ApiResponse, PaginatedResponse } from '../types';

class ChatService {
    async getMessages(page: number = 1, limit: number = 50): Promise<PaginatedResponse<Message>> {
        const response = await apiClient.get<ApiResponse<{ messages: Message[] }>>(
            `/api/chat/messages?limit=${limit}${page > 1 ? `&before=${new Date().toISOString()}` : ''}`,
            // Note: Pagination needs cursor, passing simplified for now
        );

        const messages = (response.data as any).messages || [];

        // Construct PaginatedResponse
        return {
            data: messages,
            page: page,
            limit: limit,
            total: 0, // Not returned by backend
            hasMore: messages.length === limit
        };
    }

    async sendMessage(
        type: 'text' | 'image' | 'voice' | 'gif',
        content: string,
        metadata?: any,
    ): Promise<Message> {
        const response = await apiClient.post<ApiResponse<Message>>('/api/chat/send', {
            type,
            content,
            metadata,
        });
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
}

export const chatService = new ChatService();
export default chatService;
