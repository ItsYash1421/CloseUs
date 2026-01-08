const authMiddleware = require('./authMiddleware');
const adminAuthMiddleware = require('./adminAuthMiddleware');

module.exports = {
    authMiddleware,
    adminMiddleware: adminAuthMiddleware
};
