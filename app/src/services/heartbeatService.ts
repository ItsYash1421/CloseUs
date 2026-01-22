import { AppState, AppStateStatus } from 'react-native';
import apiClient from './apiClient';

class HeartbeatService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private appStateSubscription: any = null;
  private readonly HEARTBEAT_INTERVAL = 60000; // 60 seconds

  /**
   * Start sending heartbeat to backend
   */
  start() {
    if (this.intervalId) {
      console.log('[Heartbeat] Already running');
      return;
    }

    console.log('[Heartbeat] Starting service');

    // Send initial heartbeat
    this.sendHeartbeat();

    // Set up interval
    this.intervalId = setInterval(() => {
      this.sendHeartbeat();
    }, this.HEARTBEAT_INTERVAL);

    // Listen to app state changes
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  /**
   * Stop sending heartbeat
   */
  stop() {
    console.log('[Heartbeat] Stopping service');

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  /**
   * Send heartbeat to backend
   */
  private async sendHeartbeat() {
    try {
      await apiClient.post('/api/users/heartbeat');
      console.log('[Heartbeat] Sent successfully');
    } catch (error) {
      console.error('[Heartbeat] Failed to send:', error);
    }
  }

  /**
   * Handle app state changes
   */
  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      console.log('[Heartbeat] App became active, restarting');
      this.start();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      console.log('[Heartbeat] App went to background, stopping');
      this.stop();
    }
  };
}

export default new HeartbeatService();
