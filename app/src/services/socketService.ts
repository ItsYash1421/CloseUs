import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../constants/config';
import { Message } from '../types';
import authService from './authService';

type MessageCallback = (message: Message) => void;
type TypingCallback = (isTyping: boolean) => void;
type ConnectionCallback = (connected: boolean) => void;

class SocketService {
    private socket: Socket | null = null;
    private messageCallbacks: MessageCallback[] = [];
    private typingCallbacks: TypingCallback[] = [];
    private connectionCallbacks: ConnectionCallback[] = [];

    async connect() {
        if (this.socket?.connected) {
            return;
        }

        const token = await authService.getAccessToken();
        if (!token) {
            throw new Error('No access token available');
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        this.setupListeners();
    }

    private setupListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.notifyConnection(true);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.notifyConnection(false);
        });

        this.socket.on('receive_message', (message: Message) => {
            this.messageCallbacks.forEach(callback => callback(message));
        });

        this.socket.on('partner_typing', () => {
            this.typingCallbacks.forEach(callback => callback(true));
        });

        this.socket.on('partner_stopped_typing', () => {
            this.typingCallbacks.forEach(callback => callback(false));
        });

        this.socket.on('error', (error: any) => {
            console.error('Socket error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    sendMessage(type: string, content: string, metadata?: any) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }

        this.socket.emit('send_message', { type, content, metadata });
    }

    sendTyping() {
        if (this.socket?.connected) {
            this.socket.emit('typing');
        }
    }

    sendStopTyping() {
        if (this.socket?.connected) {
            this.socket.emit('stop_typing');
        }
    }

    onMessage(callback: MessageCallback) {
        this.messageCallbacks.push(callback);
        return () => {
            this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
        };
    }

    onTyping(callback: TypingCallback) {
        this.typingCallbacks.push(callback);
        return () => {
            this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback);
        };
    }

    onConnection(callback: ConnectionCallback) {
        this.connectionCallbacks.push(callback);
        return () => {
            this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
        };
    }

    private notifyConnection(connected: boolean) {
        this.connectionCallbacks.forEach(callback => callback(connected));
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const socketService = new SocketService();
export default socketService;
