import apiClient from './apiClient';
import { Couple, CoupleStats, ApiResponse } from '../types';

class CoupleService {
  async createPairingKey(): Promise<{
    pairingKey: string;
    pairingKeyExpires: Date;
  }> {
    const response = await apiClient.post<
      ApiResponse<{ pairingKey: string; pairingKeyExpires: Date }>
    >('/api/couples/create-key');
    return response.data!;
  }

  async refreshPairingKey(): Promise<{
    pairingKey: string;
    pairingKeyExpires: Date;
  }> {
    const response = await apiClient.post<
      ApiResponse<{ pairingKey: string; pairingKeyExpires: Date }>
    >('/api/couples/refresh-key');
    return response.data!;
  }

  async checkPairingStatus(): Promise<{ isPaired: boolean; couple?: Couple }> {
    const response = await apiClient.get<
      ApiResponse<{ isPaired: boolean; couple?: Couple }>
    >('/api/couples/check-pairing-status');
    return response.data!;
  }

  async pairWithPartner(pairingKey: string): Promise<Couple> {
    const response = await apiClient.post<ApiResponse<Couple>>(
      '/api/couples/pair',
      {
        pairingKey,
      },
    );
    return response.data!;
  }

  async devPair(): Promise<Couple> {
    const response = await apiClient.post<ApiResponse<Couple>>(
      '/api/couples/dev-pair',
    );
    return response.data!;
  }

  async getCoupleInfo(): Promise<Couple> {
    const response =
      await apiClient.get<ApiResponse<Couple>>('/api/couples/me');
    return response.data!;
  }

  async getCoupleStats(): Promise<CoupleStats> {
    const response =
      await apiClient.get<ApiResponse<CoupleStats>>('/api/couples/stats');
    return response.data!;
  }

  async getTimeTogether(): Promise<{
    years: number;
    months: number;
    days: number;
  }> {
    const response = await apiClient.get<
      ApiResponse<{ years: number; months: number; days: number }>
    >('/api/couples/time-together');
    return response.data!;
  }
}

export const coupleService = new CoupleService();
export default coupleService;
