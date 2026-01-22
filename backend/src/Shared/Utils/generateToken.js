const jwt = require('jsonwebtoken');

// ------------------------------------------------------------------
// Generate Access Token
// ------------------------------------------------------------------
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

module.exports = generateToken;
