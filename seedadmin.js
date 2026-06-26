require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./Admin/Admin.models');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Delete existing admin
        await Admin.deleteMany({});
        console.log('Existing admins removed');

        // Create new admin
        const newAdmin = await Admin.create({
            email: 'admin@canvas.com',
            password: 'Admin@123',
        });

        console.log('Admin created successfully:');
        console.log('Email:', newAdmin.email);
        console.log('ID:', newAdmin._id);

        await mongoose.disconnect();
        console.log('Done!');
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedAdmin();