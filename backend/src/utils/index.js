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
    // Get first name only and capitalize first letter
    const firstName1 = name1.split(' ')[0];
    const firstName2 = name2.split(' ')[0];

    const capitalizedName1 = firstName1.charAt(0).toUpperCase() + firstName1.slice(1).toLowerCase();
    const capitalizedName2 = firstName2.charAt(0).toUpperCase() + firstName2.slice(1).toLowerCase();

    return `#${capitalizedName1}${capitalizedName2}`;
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

    // Get current time in IST
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + IST_OFFSET_MS);

    // Get start date in IST
    const startUTC = new Date(startDate);
    const startIST = new Date(startUTC.getTime() + IST_OFFSET_MS);

    // Reset both to midnight IST for accurate day counting
    const nowISTMidnight = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate());
    const startISTMidnight = new Date(startIST.getFullYear(), startIST.getMonth(), startIST.getDate());

    // Calculate difference in days
    const diffMs = nowISTMidnight - startISTMidnight;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    return {
        days: diffDays,
        months: diffMonths,
        years: diffYears
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
