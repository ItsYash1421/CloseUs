const jwt = require('jsonwebtoken');
const { JWT } = require('@closeus/constants');

/**
 * Generate JWT access token
 */
const generateToken = (payload, expiresIn = JWT.EXPIRES_IN) => {
    return jwt.sign(payload, JWT.SECRET, { expiresIn });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT.SECRET, { expiresIn: JWT.REFRESH_EXPIRES_IN });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT.SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Generate couple tag from two names
 * Example: "Yash" + "Khushi" = "#Yaskhu"
 */
const generateCoupleTag = (name1, name2) => {
    const part1 = name1.substring(0, Math.min(3, name1.length));
    const part2 = name2.substring(0, Math.min(4, name2.length));
    return `#${part1}${part2}`.toLowerCase();
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
 * Calculate days together
 */
const calculateDaysTogether = (anniversary) => {
    const now = new Date();
    const start = new Date(anniversary);
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

/**
 * Calculate years, months, days together
 */
const calculateTimeTogether = (anniversary) => {
    const now = new Date();
    const start = new Date(anniversary);

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

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
    successResponse,
    errorResponse
};
