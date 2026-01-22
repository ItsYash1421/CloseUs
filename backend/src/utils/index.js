const jwt = require('jsonwebtoken');

/**
 * Generate JWT access token
 */
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Generate couple tag from two names
 * Example: "Yash" + "Khushi" = "#Yaskhu"
 */
const generateCoupleTag = (name1, name2) => {
    // Get first name only
    const firstName1 = name1.split(' ')[0];
    const firstName2 = name2.split(' ')[0];

    // Take first 3 letters (or less if name is shorter)
    const part1 = firstName1.substring(0, 3);
    const part2 = firstName2.substring(0, 3);

    const capitalizedPart1 = part1.charAt(0).toUpperCase() + part1.slice(1).toLowerCase();
    const capitalizedPart2 = part2.charAt(0).toUpperCase() + part2.slice(1).toLowerCase();

    return `#${capitalizedPart1}${capitalizedPart2}`;
};

/**
 * Generate random pairing key (6 characters)
 */
const generatePairingKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 6; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
};

/**
 * Calculate time together from start date (IST timezone)
 */
const calculateTimeTogether = (startDate) => {
    // IST is UTC+5:30
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    const start = new Date(startDate);
    const now = new Date();

    // Convert to IST timestamps
    const startIST = start.getTime() + IST_OFFSET_MS;
    const nowIST = now.getTime() + IST_OFFSET_MS;

    // Floor to get the day number (independent of time)
    const msPerDay = 1000 * 60 * 60 * 24;
    const startDay = Math.floor(startIST / msPerDay);
    const nowDay = Math.floor(nowIST / msPerDay);

    const diffDays = nowDay - startDay;

    // Calculate approx months/years for display
    // Note: For precise calendar month difference we'd need Date objects, 
    // but this approximation is usually sufficient for "Time Together" stats
    // or we can reconstruct valid Dates if needed.

    // Improved month/year calc:
    // Reconstruct dates at UTC noon to avoid boundary issues
    const date1 = new Date(startDay * msPerDay);
    const date2 = new Date(nowDay * msPerDay);

    let years = date2.getUTCFullYear() - date1.getUTCFullYear();
    let months = date2.getUTCMonth() - date1.getUTCMonth();
    let days = date2.getUTCDate() - date1.getUTCDate();

    if (days < 0) {
        months--;
        // Get days in previous month
        const prevMonth = new Date(date2.getUTCFullYear(), date2.getUTCMonth(), 0);
        days += prevMonth.getUTCDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return {
        days: diffDays, // Total days
        months: months + (years * 12), // Total months
        years: years
    };
};

/**
 * Get next milestone based on current days with progressive gaps
 * Early phase → small wins (10 days)
 * Medium phase → 25 days
 * Long phase → 50 days
 * Very long → 100 days
 */
const getNextMilestone = (days) => {
    let step;

    if (days < 100) step = 10;
    else if (days < 300) step = 25;
    else if (days < 700) step = 50;
    else step = 100;

    return Math.ceil(days / step) * step;
};

/**
 * Calculate days together (IST timezone)
 */
const calculateDaysTogether = (anniversary) => {
    // IST is UTC+5:30
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    // Get current time in IST
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + IST_OFFSET_MS);

    // Get start date in IST
    const startUTC = new Date(anniversary);
    const startIST = new Date(startUTC.getTime() + IST_OFFSET_MS);

    // Reset both to midnight IST for accurate day counting
    const nowISTMidnight = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate());
    const startISTMidnight = new Date(startIST.getFullYear(), startIST.getMonth(), startIST.getDate());

    const diffTime = Math.abs(nowISTMidnight - startISTMidnight);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

/**
    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
};

/**
 * Success response helper
 */
const successResponse = (data, message = 'Success') => {
    return {
        success: true,
        message,
        data
    };
};

/**
 * Error response helper
 */
const errorResponse = (message, statusCode = 500) => {
    return {
        success: false,
        message,
        statusCode
    };
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    generateCoupleTag,
    generatePairingKey,
    calculateDaysTogether,
    calculateTimeTogether,
    getNextMilestone,
    successResponse,
    errorResponse
};
