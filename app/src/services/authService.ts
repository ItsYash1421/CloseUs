import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import { GOOGLE_WEB_CLIENT_ID } from '../constants/config';
import { LoginResponse, AuthTokens, User } from '../types';

class AuthService {
  constructor() {
    this.configureGoogleSignIn();
  }

  private configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }

  async googleSignIn(): Promise<LoginResponse> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Send to backend
      const response = await apiClient.post<{ data: LoginResponse }>(
        '/api/auth/google/mobile',
        {
          idToken: userInfo.data?.idToken,
          user: userInfo.data?.user,
        },
      );

      const { user, tokens } = response.data;

      // Store tokens and user
      await this.storeAuthData(user, tokens);

      return response.data;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  async storeAuthData(user: User, tokens: AuthTokens) {
    await AsyncStorage.multiSet([
      ['accessToken', tokens.accessToken],
      ['refreshToken', tokens.refreshToken],
      ['user', JSON.stringify(user)],
    ]);
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('accessToken');
  }

  async refreshAccessToken(): Promise<string> {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ data: { accessToken: string } }>(
      '/api/auth/refresh',
      { refreshToken },
    );

    const { accessToken } = response.data;
    await AsyncStorage.setItem('accessToken', accessToken);
    return accessToken;
  }

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      await GoogleSignin.signOut();
    }
  }

  async verifyAuth(): Promise<User> {
    const response = await apiClient.get<{ data: User }>('/api/auth/verify');
    return response.data;
  }
}

export const authService = new AuthService();
export default authService;
