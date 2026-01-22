export const trackEvent = (eventName, properties = {}) => {
    if (import.meta.env.MODE === 'production') {
        const { track } = require('@vercel/analytics');
        track(eventName, properties);
    } else {
        console.log('Analytics (dev):', eventName, properties);
    }
};
