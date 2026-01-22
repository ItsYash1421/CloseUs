const jwt = require('jsonwebtoken');

// ------------------------------------------------------------------
// Verify JWT Token
// ------------------------------------------------------------------
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = verifyToken;
