import apiClient from './apiClient';
import { useCoupleStore } from '../store/coupleStore';
import { ApiResponse } from '../types';

class PartnerStatusService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly POLL_INTERVAL = 120000; // 2 minutes

  /**
   * Start polling partner's online status
   */
  start() {
    if (this.intervalId) {
      console.log('[PartnerStatus] Already polling');
      return;
    }

    console.log('[PartnerStatus] Starting polling');

    // Fetch initial status
    this.fetchPartnerStatus();

    // Set up interval
    this.intervalId = setInterval(() => {
      this.fetchPartnerStatus();
    }, this.POLL_INTERVAL);
  }

  /**
   * Stop polling partner's status
   */
  stop() {
    console.log('[PartnerStatus] Stopping polling');

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Fetch partner's online status from backend
   */
  private async fetchPartnerStatus() {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          name: string;
          photoUrl: string;
          isOnline: boolean;
          lastActive: string | null;
        }>
      >('/api/users/partner-status');

      // Log raw response for verification
      console.log('[PartnerStatus] Response data:', response.data);

      if (response.data) {
        // response.data IS the partner data object in this context
        // Type casting to any to bypass TS confusion about ApiResponse structure vs actual response
        const partnerData = response.data as any;

        // Validate essential fields
        if (partnerData.name !== undefined) {
          // Update Zustand store
          useCoupleStore.getState().setPartnerStatus({
            isOnline: partnerData.isOnline,
            lastActive: partnerData.lastActive
              ? new Date(partnerData.lastActive)
              : null,
          });

          console.log(
            '[PartnerStatus] Updated store. isOnline:',
            partnerData.isOnline,
          );
        } else if (partnerData.data) {
          // Fallback for wrapped structure if it changes
          const innerData = partnerData.data;
          useCoupleStore.getState().setPartnerStatus({
            isOnline: innerData.isOnline,
            lastActive: innerData.lastActive
              ? new Date(innerData.lastActive)
              : null,
          });
          console.log(
            '[PartnerStatus] Updated store (wrapped). isOnline:',
            innerData.isOnline,
          );
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('[PartnerStatus] User not paired yet, stopping polling');
        this.stop();
      } else {
        console.error('[PartnerStatus] Failed to fetch:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: error.config?.url,
        });
      }
    }
  }

  /**
   * Manually refresh partner status
   */
  async refresh() {
    await this.fetchPartnerStatus();
  }
}

export default new PartnerStatusService();
