import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Couple, CoupleStats, User } from '../types';
import { coupleService } from '../services/coupleService';
import { getErrorMessage } from '../utils/errorHandler';

interface CoupleState {
    couple: Couple | null;
    partner: User | null;
    stats: CoupleStats | null;
    pairingKey: string | null;
    pairingKeyExpires: Date | null;
    pairingAttempts: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    setCouple: (couple: Couple | null) => void;
    setPartner: (partner: User | null) => void;
    createPairingKey: () => Promise<string>;
    refreshPairingKey: () => Promise<string>;
    checkPairingStatus: () => Promise<boolean>;
    pairWithPartner: (key: string) => Promise<void>;
    devPair: () => Promise<void>;
    fetchCoupleInfo: () => Promise<void>;
    fetchCoupleStats: () => Promise<void>;
    clearPairingKey: () => void;
    clearCouple: () => void;
}

export const useCoupleStore = create<CoupleState>()(
    persist(
        (set, get) => ({
            couple: null,
            partner: null,
            stats: null,
            pairingKey: null,
            pairingKeyExpires: null,
            pairingAttempts: 0,
            isLoading: false,
            error: null,

            setCouple: (couple) => set({ couple }),

            setPartner: (partner) => set({ partner }),

            createPairingKey: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const { pairingKey, expiresAt } = await coupleService.createPairingKey();
                    set({
                        pairingKey,
                        pairingKeyExpires: new Date(expiresAt),
                        pairingAttempts: 0,
                        isLoading: false,
                    });
                    return pairingKey;
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                    throw error;
                }
            },

            refreshPairingKey: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const { pairingKey, pairingKeyExpires } = await coupleService.refreshPairingKey();
                    set({
                        pairingKey,
                        pairingKeyExpires: new Date(pairingKeyExpires),
                        pairingAttempts: 0,
                        isLoading: false,
                    });
                    return pairingKey;
                } catch (error: any) {
                    set({ error: getErrorMessage(error), isLoading: false });
                    throw error;
                }
            },

            checkPairingStatus: async () => {
                try {
                    const { isPaired, couple } = await coupleService.checkPairingStatus();
                    if (isPaired && couple) {
                        set({ couple, pairingKey: null, pairingKeyExpires: null });
                    }
                    return isPaired;
                } catch (error: any) {
                    console.error('Check pairing status error:', error);
                    return false;
                }
            },

            pairWithPartner: async (key: string) => {
                try {
                    set({ isLoading: true, error: null });
                    const couple = await coupleService.pairWithPartner(key);
                    set({ couple, isLoading: false, pairingKey: null });
                } catch (error: any) {
                    set({ error: getErrorMessage(error), isLoading: false });
                    throw error;
                }
            },

            devPair: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const couple = await coupleService.devPair();
                    set({ couple, isLoading: false, pairingKey: null });
                } catch (error: any) {
                    set({ error: getErrorMessage(error), isLoading: false });
                    throw error;
                }
            },

            fetchCoupleInfo: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const couple = await coupleService.getCoupleInfo();
                    set({ couple, isLoading: false });
                } catch (error: any) {
                    set({ error: getErrorMessage(error), isLoading: false });
                }
            },

            fetchCoupleStats: async () => {
                try {
                    const stats = await coupleService.getCoupleStats();
                    set({ stats });
                } catch (error: any) {
                    console.error('Failed to fetch couple stats:', error);
                }
            },

            clearPairingKey: () => set({ pairingKey: null, pairingKeyExpires: null }),

            clearCouple: () => set({
                couple: null,
                partner: null,
                stats: null,
                pairingKey: null,
                pairingKeyExpires: null,
                error: null,
            }),
        }),
        {
            name: 'couple-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                couple: state.couple,
                partner: state.partner,
                stats: state.stats,
                // Don't persist temporary pairing data
            }),
        }
    )
);

