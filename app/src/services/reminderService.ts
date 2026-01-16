import notificationService from './notificationService';
import { differenceInDays, addDays, setHours, setMinutes, isSameDay } from 'date-fns';

interface SpecialOccasion {
    id: string;
    name: string;
    date: Date;
    emoji: string;
    reminderDays: number[]; // Days before to send reminders
}

class ReminderService {
    // Special occasions that repeat yearly
    private yearlyOccasions = [
        { name: "Valentine's Day", month: 1, day: 14, emoji: '💕' },
        { name: "Kiss Day", month: 1, day: 13, emoji: '💋' },
        { name: "Hug Day", month: 1, day: 12, emoji: '🤗' },
        { name: "Chocolate Day", month: 1, day: 9, emoji: '🍫' },
        { name: "Rose Day", month: 1, day: 7, emoji: '🌹' },
        { name: "Christmas", month: 11, day: 25, emoji: '🎄' },
        { name: "New Year", month: 11, day: 31, emoji: '🎉' },
    ];

    async scheduleAllReminders(
        partnerBirthday: Date,
        anniversary: Date,
        partnerName: string,
    ) {
        try {
            // Schedule birthday reminders
            await this.scheduleBirthdayReminders(partnerBirthday, partnerName);

            // Schedule anniversary reminders
            await this.scheduleAnniversaryReminders(anniversary);

            // Schedule special occasion reminders
            await this.scheduleSpecialOccasions();

            // Schedule daily engagement reminders
            await this.scheduleDailyReminders();
        } catch (error) {
            console.error('Error scheduling all reminders:', error);
        }
    }

    async scheduleBirthdayReminders(birthday: Date, partnerName: string) {
        try {
            const now = new Date();
            const thisYearBirthday = new Date(
                now.getFullYear(),
                birthday.getMonth(),
                birthday.getDate(),
            );

            // If birthday already passed this year, schedule for next year
            const targetBirthday = thisYearBirthday < now
                ? new Date(now.getFullYear() + 1, birthday.getMonth(), birthday.getDate())
                : thisYearBirthday;

            // Schedule reminders: 5 days, 3 days, 1 day, and on the day
            const reminderDays = [5, 3, 1, 0];

            for (const days of reminderDays) {
                const reminderDate = addDays(targetBirthday, -days);
                const notificationTime = setMinutes(setHours(reminderDate, 9), 0); // 9 AM

                if (notificationTime > now) {
                    const title = days === 0
                        ? `🎂 ${partnerName}'s Birthday Today!`
                        : `🎂 ${partnerName}'s Birthday in ${days} days`;

                    const body = days === 0
                        ? `Don't forget to wish ${partnerName} a happy birthday! 🎉`
                        : `${partnerName}'s birthday is coming up. Plan something special! 💝`;

                    await notificationService.scheduleNotification(
                        `birthday-${days}`,
                        title,
                        body,
                        notificationTime,
                        { type: 'birthday', screen: 'Profile' },
                    );
                }
            }
        } catch (error) {
            console.error('Error scheduling birthday reminders:', error);
        }
    }

    async scheduleAnniversaryReminders(anniversary: Date) {
        const now = new Date();
        const thisYearAnniversary = new Date(
            now.getFullYear(),
            anniversary.getMonth(),
            anniversary.getDate(),
        );

        const targetAnniversary = thisYearAnniversary < now
            ? new Date(now.getFullYear() + 1, anniversary.getMonth(), anniversary.getDate())
            : thisYearAnniversary;

        // Schedule reminders: 7 days, 5 days, 3 days, 1 day, and on the day
        const reminderDays = [7, 5, 3, 1, 0];

        for (const days of reminderDays) {
            const reminderDate = addDays(targetAnniversary, -days);
            const notificationTime = setMinutes(setHours(reminderDate, 9), 0);

            if (notificationTime > now) {
                const title = days === 0
                    ? `💕 Happy Anniversary!`
                    : `💕 Anniversary in ${days} days`;

                const body = days === 0
                    ? `Celebrate your special day together! 🎉`
                    : `Your anniversary is coming up. Make it memorable! 💝`;

                await notificationService.scheduleNotification(
                    `anniversary-${days}`,
                    title,
                    body,
                    notificationTime,
                    { type: 'anniversary', screen: 'Home' },
                );
            }
        }
    }

    async scheduleSpecialOccasions() {
        const now = new Date();

        for (const occasion of this.yearlyOccasions) {
            const thisYearDate = new Date(
                now.getFullYear(),
                occasion.month,
                occasion.day,
            );

            const targetDate = thisYearDate < now
                ? new Date(now.getFullYear() + 1, occasion.month, occasion.day)
                : thisYearDate;

            // Remind 3 days before and on the day
            const reminderDays = [3, 1, 0];

            for (const days of reminderDays) {
                const reminderDate = addDays(targetDate, -days);
                const notificationTime = setMinutes(setHours(reminderDate, 10), 0);

                if (notificationTime > now) {
                    const title = days === 0
                        ? `${occasion.emoji} ${occasion.name} Today!`
                        : `${occasion.emoji} ${occasion.name} in ${days} days`;

                    const body = days === 0
                        ? `Celebrate ${occasion.name} with your partner! 💕`
                        : `${occasion.name} is coming up. Plan something special!`;

                    await notificationService.scheduleNotification(
                        `occasion-${occasion.name}-${days}`,
                        title,
                        body,
                        notificationTime,
                        { type: 'occasion', occasion: occasion.name, screen: 'Home' },
                    );
                }
            }
        }
    }

    async scheduleDailyReminders() {
        const now = new Date();

        // Morning reminder - "Good morning! Say hi to your partner"
        const morningTime = setMinutes(setHours(new Date(), 8), 0);
        if (morningTime > now) {
            await notificationService.scheduleNotification(
                'daily-morning',
                '☀️ Good Morning!',
                'Start your day by saying hi to your partner 💕',
                morningTime,
                { type: 'daily', screen: 'Chat' },
            );
        }

        // Evening reminder - "Answer today's question together"
        const eveningTime = setMinutes(setHours(new Date(), 19), 0);
        if (eveningTime > now) {
            await notificationService.scheduleNotification(
                'daily-evening',
                '❓ Daily Question Time!',
                "Don't forget to answer today's question together 💭",
                eveningTime,
                { type: 'daily', screen: 'Questions' },
            );
        }

        // Night reminder - "Say goodnight to your partner"
        const nightTime = setMinutes(setHours(new Date(), 21), 30);
        if (nightTime > now) {
            await notificationService.scheduleNotification(
                'daily-night',
                '🌙 Goodnight!',
                'Send a sweet goodnight message to your partner 💤',
                nightTime,
                { type: 'daily', screen: 'Chat' },
            );
        }
    }

    async scheduleInactivityReminder() {
        // If partner hasn't messaged in 24 hours
        const reminderTime = addDays(new Date(), 1);

        await notificationService.scheduleNotification(
            'inactivity-reminder',
            '💭 Missing Your Partner?',
            "You haven't chatted in a while. Send them a message! 💕",
            reminderTime,
            { type: 'inactivity', screen: 'Chat' },
        );
    }

    async cancelInactivityReminder() {
        await notificationService.cancelNotification('inactivity-reminder');
    }

    async rescheduleAllReminders(
        partnerBirthday: Date,
        anniversary: Date,
        partnerName: string,
    ) {
        // Cancel all existing reminders
        await notificationService.cancelAllNotifications();

        // Schedule new ones
        await this.scheduleAllReminders(partnerBirthday, anniversary, partnerName);
    }
}

export const reminderService = new ReminderService();
export default reminderService;
