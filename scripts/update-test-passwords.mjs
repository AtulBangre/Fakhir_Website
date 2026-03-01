import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function updatePasswords() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        const testUsers = [
            { email: process.env.TEST_SUPER_ADMIN_EMAIL, role: 'super-admin', name: 'Super Admin' },
            { email: process.env.TEST_ADMIN_EMAIL, role: 'admin', name: 'Sarah Mitchell' },
            { email: process.env.TEST_CLIENT_EMAIL, role: 'client', name: 'John Doe' }
        ];

        const hashedPassword = await bcrypt.hash(process.env.TEST_PASSWORD, 10);

        for (const userData of testUsers) {
            let user = await User.findOne({ email: userData.email });
            if (user) {
                user.password = hashedPassword;
                user.role = userData.role;
                await user.save();
                console.log(`Updated password for ${userData.role}: ${userData.email}`);
            } else {
                user = await User.create({
                    ...userData,
                    password: hashedPassword,
                    status: 'active',
                    joinedDate: new Date()
                });
                console.log(`Created test user for ${userData.role}: ${userData.email}`);
            }
        }

        console.log('Test users updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating passwords:', error);
        process.exit(1);
    }
}

updatePasswords();
