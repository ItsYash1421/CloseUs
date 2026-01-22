import notificationService from './notificationService';
import userStateNotificationService from './userStateNotificationService';
import { useAuthStore } from '../store/authStore';
import { useCoupleStore } from '../store/coupleStore';

class DailyNotificationScheduler {
  private intervalId: number | null = null;

  /**
   * Start daily notification re-scheduling
   * Checks every hour and re-schedules notifications for the next day
   */
  start() {
    // Check immediately on start
    this.checkAndReschedule();

    // Then check every hour
    this.intervalId = setInterval(
      () => {
        this.checkAndReschedule();
      },
      60 * 60 * 1000,
    ); // Every hour
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async checkAndReschedule() {
    try {
      const now = new Date();
      const hour = now.getHours();

      // Re-schedule at midnight (12 AM)
      if (hour === 0) {
        console.log('Midnight - Re-scheduling daily notifications');
        await this.rescheduleAllDailyNotifications();
      }
    } catch (error) {
      console.error('Error in daily notification scheduler:', error);
    }
  }

  private async rescheduleAllDailyNotifications() {
    try {
      const user = useAuthStore.getState().user;
      const couple = useCoupleStore.getState().couple;
      const partner = useCoupleStore.getState().partner;

      if (!user) {
        // Not logged in
        await userStateNotificationService.scheduleForNotLoggedIn();
      } else if (!couple) {
        // Logged in but not paired
        await userStateNotificationService.scheduleForNotPaired();
      } else if (partner) {
        // Paired
        await userStateNotificationService.scheduleForPaired(
          partner.name || 'Partner',
        );
      }

      console.log('Daily notifications re-scheduled successfully');
    } catch (error) {
      console.error('Error re-scheduling daily notifications:', error);
    }
  }
}

export const dailyNotificationScheduler = new DailyNotificationScheduler();
export default dailyNotificationScheduler;
