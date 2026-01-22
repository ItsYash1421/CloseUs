const Admin = require('../../models/Admin');
const { generateToken, successResponse, errorResponse } = require('../../Shared/Utils');

/**
 * Admin Login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(errorResponse('Email and password required', 400));
        }

        // Find admin by email or username
        const admin = await Admin.findOne({
            $or: [{ email }, { username: email }],
            isActive: true,
        });

        if (!admin) {
            return res.status(401).json(errorResponse('Invalid credentials', 401));
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json(errorResponse('Invalid credentials', 401));
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate token
        const token = generateToken({
            adminId: admin._id,
            role: admin.role
        });

        res.json(successResponse({
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                username: admin.username,
                role: admin.role,
            },
        }, 'Login successful'));
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Get Admin Profile
 */
const getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        if (!admin) {
            return res.status(404).json(errorResponse('Admin not found', 404));
        }
        res.json(successResponse(admin));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    login,
    getProfile,
};
