import { track } from '@vercel/analytics';

export const trackEvent = (eventName, properties = {}) => {
    if (import.meta.env.MODE === 'production') {
        track(eventName, properties);
    } else {
        console.log('Analytics (dev):', eventName, properties);
    }
};
