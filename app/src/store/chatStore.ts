import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isTyping: false,
      isConnected: false,
      isLoading: false,
      hasMore: true,
      page: 1,

      setMessages: messages => set({ messages }),

      addMessage: message => {
        const messages = get().messages;
        // Check if message already exists (prevent duplicates)
        const messageExists = messages.some(m => m._id === message._id);

        if (!messageExists) {
          // Check if there is a pending/optimistic message that matches this new message
          // We match by content and sender, and ensure the pending one has a temp ID
          const pendingMessageIndex = messages.findIndex(
            m =>
              typeof m._id === 'string' &&
              m._id.startsWith('temp-') &&
              m.content === message.content &&
              // Handle both object and string senderId formats
              (typeof m.senderId === 'string'
                ? m.senderId
                : (m.senderId as unknown as { _id: string })._id) ===
                (typeof message.senderId === 'string'
                  ? message.senderId
                  : (message.senderId as unknown as { _id: string })._id),
          );

          if (pendingMessageIndex !== -1) {
            // Replace the pending message with the real, confirmed message
            // We create a new array to ensure immutability
            const newMessages = [...messages];
            newMessages[pendingMessageIndex] = message;
            set({ messages: newMessages });
          } else {
            // For inverted FlatList, add new messages at the START (index 0)
            set({ messages: [message, ...messages] });
          }
        }
      },

      setTyping: isTyping => set({ isTyping }),

      setConnected: isConnected => set({ isConnected }),

      loadMessages: async (page = 1) => {
        try {
          set({ isLoading: true });

          if (page === 1) {
            // Initial load - get latest 10 messages only
            const messages = await chatService.getRecentMessages();

            set({
              messages: messages,
              hasMore: messages.length === 10, // Has more if we got exactly 10
              page: 1,
              isLoading: false,
            });
          } else {
            // Load older messages with pagination
            const currentMessages = get().messages;
            const oldestMessage =
              currentMessages.length > 0
                ? currentMessages[currentMessages.length - 1]
                : null;

            if (!oldestMessage) {
              set({ isLoading: false });
              return;
            }

            const before =
              typeof oldestMessage.createdAt === 'string'
                ? oldestMessage.createdAt
                : new Date(oldestMessage.createdAt).toISOString();

            const response = await chatService.getOlderMessages(before, 20);

            // Append older messages to the end (avoid duplicates)
            const newMessages = response.data;
            const existingIds = new Set(currentMessages.map(m => m._id));
            const uniqueNewMessages = newMessages.filter(
              m => !existingIds.has(m._id),
            );

            set({
              messages: [...currentMessages, ...uniqueNewMessages],
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
          // OPTIMISTIC UPDATE: Add message immediately to UI
          const { useAuthStore } = require('./authStore'); // Lazy import to avoid cycle
          const user = useAuthStore.getState().user;

          if (user) {
            const tempId = `temp-${Date.now()}`;
            const optimisticMessage: Message = {
              _id: tempId,
              coupleId: user.coupleId || '',
              senderId: user._id,
              type: 'text',
              content: text,
              isRead: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            get().addMessage(optimisticMessage);
          }

          // Send via socket - let server/socket handle adding the confirmed message
          // This ensures correct senderId from server
          socketService.sendMessage('text', text);
        } catch (error) {
          console.error('Failed to send message:', error);
          // TODO: Could remove the optimistic message on error if needed
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

          // Set connected to true after successful connection
          set({ isConnected: true });

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
          set({ isConnected: false });
        }
      },

      disconnectSocket: () => {
        socketService.disconnect();
        set({ isConnected: false });
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Optimization: Only persist essential data.
      // Exclude ephemeral state like isTyping, isConnected, isLoading which causes
      // unnecessary expensive writes to storage on frequent updates.
      partialize: state => ({
        messages: state.messages,
        hasMore: state.hasMore,
        page: state.page,
      }),
    },
  ),
);
