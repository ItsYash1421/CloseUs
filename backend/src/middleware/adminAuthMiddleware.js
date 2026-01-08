const { verifyToken, errorResponse } = require('../utils');

const adminAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(errorResponse('No token provided', 401));
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded || !decoded.adminId) {
            return res.status(401).json(errorResponse('Invalid token', 401));
        }

        req.adminId = decoded.adminId;
        req.adminRole = decoded.role;
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.status(401).json(errorResponse('Authentication failed', 401));
    }
};

module.exports = adminAuthMiddleware;
