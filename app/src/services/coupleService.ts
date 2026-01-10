import apiClient from './apiClient';
import { Couple, CoupleStats, ApiResponse } from '../types';

class CoupleService {
    async createPairingKey(): Promise<{ pairingKey: string; expiresAt: Date }> {
        const response = await apiClient.post<ApiResponse<{ pairingKey: string; expiresAt: Date }>>(
            '/api/couples/create-key',
        );
        return response.data!;
    }

    async pairWithPartner(pairingKey: string): Promise<Couple> {
        const response = await apiClient.post<ApiResponse<Couple>>('/api/couples/pair', {
            pairingKey,
        });
        return response.data!;
    }

    async devPair(): Promise<Couple> {
        const response = await apiClient.post<ApiResponse<Couple>>('/api/couples/dev-pair');
        return response.data!;
    }

    async getCoupleInfo(): Promise<Couple> {
        const response = await apiClient.get<ApiResponse<Couple>>('/api/couples/me');
        return response.data!;
    }

    async getCoupleStats(): Promise<CoupleStats> {
        const response = await apiClient.get<ApiResponse<CoupleStats>>('/api/couples/stats');
        return response.data!;
    }
}

export const coupleService = new CoupleService();
export default coupleService;
