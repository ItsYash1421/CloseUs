const generateToken = require('./generateToken');
const generateRefreshToken = require('./generateRefreshToken');
const verifyToken = require('./verifyToken');
const generateCoupleTag = require('./generateCoupleTag');
const generatePairingKey = require('./generatePairingKey');
const calculateTimeTogether = require('./calculateTimeTogether');
const calculateDaysTogether = require('./calculateDaysTogether');
const getNextMilestone = require('./getNextMilestone');
const successResponse = require('./successResponse');
const errorResponse = require('./errorResponse');

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    generateCoupleTag,
    generatePairingKey,
    calculateTimeTogether,
    calculateDaysTogether,
    getNextMilestone,
    successResponse,
    errorResponse
};
