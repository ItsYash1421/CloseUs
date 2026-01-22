import { create } from 'zustand';
import { Message } from '../types';
import chatService from '../services/chatService';
import socketService from '../services/socketService';

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isConnected: boolean;
  isLoading: boolean;
  hasMore: boolean;
  page: number;

  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTyping: (isTyping: boolean) => void;
  setConnected: (isConnected: boolean) => void;
  loadMessages: (page?: number) => Promise<void>;
  sendTextMessage: (text: string) => Promise<void>;
  sendImageMessage: (imageUri: string) => Promise<void>;
  sendVoiceMessage: (audioUri: string, duration: number) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  connectSocket: () => Promise<void>;
  disconnectSocket: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  isConnected: false,
  isLoading: false,
  hasMore: true,
  page: 1,

  setMessages: messages => set({ messages }),

  addMessage: message => {
    const messages = get().messages;
    set({ messages: [...messages, message] });
  },

  setTyping: isTyping => set({ isTyping }),

  setConnected: isConnected => set({ isConnected }),

  loadMessages: async (page = 1) => {
    try {
      set({ isLoading: true });
      const response = await chatService.getMessages(page, 50);

      if (page === 1) {
        set({
          messages: response.data.reverse(),
          hasMore: response.hasMore,
          page: 1,
          isLoading: false,
        });
      } else {
        const currentMessages = get().messages;
        set({
          messages: [...response.data.reverse(), ...currentMessages],
          hasMore: response.hasMore,
          page,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      set({ isLoading: false });
    }
  },

  sendTextMessage: async (text: string) => {
    try {
      // Optimistically add message
      const tempMessage: Message = {
        _id: `temp-${Date.now()}`,
        coupleId: '',
        senderId: '',
        type: 'text',
        content: text,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      get().addMessage(tempMessage);

      // Send via socket for real-time delivery
      socketService.sendMessage('text', text);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },

  sendImageMessage: async (imageUri: string) => {
    try {
      const imageUrl = await chatService.uploadImage(imageUri);
      socketService.sendMessage('image', imageUrl);
    } catch (error) {
      console.error('Failed to send image:', error);
      throw error;
    }
  },

  sendVoiceMessage: async (audioUri: string, duration: number) => {
    try {
      const audioUrl = await chatService.uploadVoice(audioUri, duration);
      socketService.sendMessage('voice', audioUrl, { duration });
    } catch (error) {
      console.error('Failed to send voice message:', error);
      throw error;
    }
  },

  markMessageAsRead: async (messageId: string) => {
    try {
      await chatService.markAsRead(messageId);
      const messages = get().messages.map(msg =>
        msg._id === messageId ? { ...msg, isRead: true } : msg,
      );
      set({ messages });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  },

  connectSocket: async () => {
    try {
      await socketService.connect();

      // Listen for incoming messages
      socketService.onMessage(message => {
        get().addMessage(message);
      });

      // Listen for typing indicators
      socketService.onTyping(isTyping => {
        set({ isTyping });
      });

      // Listen for connection status
      socketService.onConnection(isConnected => {
        set({ isConnected });
      });
    } catch (error) {
      console.error('Failed to connect socket:', error);
    }
  },

  disconnectSocket: () => {
    socketService.disconnect();
    set({ isConnected: false });
  },
}));
