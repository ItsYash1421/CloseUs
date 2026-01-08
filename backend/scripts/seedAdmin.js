require('dotenv').config();
const connectDB = require('../src/config/db');
const Admin = require('../src/models/Admin');

const seedAdmin = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: 'ysshh_001' });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        // Create admin
        const admin = await Admin.create({
            name: 'Yash',
            username: 'ysshh_001',
            email: 'yashbt22csd@gmail.com',
            phone: '8290547697',
            password: 'Admin@123456', // User should change this
            role: 'super_admin',
        });

        console.log('✅ Admin created successfully!');
        console.log('Email:', admin.email);
        console.log('Username:', admin.username);
        console.log('Password: Admin@123456 (PLEASE CHANGE THIS IMMEDIATELY)');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
