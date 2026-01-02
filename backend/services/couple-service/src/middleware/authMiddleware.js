const { verifyToken } = require('@closeus/utils');
const { errorResponse } = require('@closeus/utils');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(errorResponse('No token provided', 401));
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json(errorResponse('Invalid or expired token', 401));
        }

        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json(errorResponse('Authentication failed', 401));
    }
};

module.exports = authMiddleware;
