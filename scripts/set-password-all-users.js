/**
 * Script to set password to "123456" for all users in the database
 * 
 * This script will:
 * 1. Connect to MongoDB
 * 2. Hash the password "123456" using bcrypt
 * 3. Update all users with the hashed password
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://fakhri_db:yZYRUaY1QP2XOovD@ac-fdjdt3f-shard-00-00.60chvjn.mongodb.net:27017,ac-fdjdt3f-shard-00-01.60chvjn.mongodb.net:27017,ac-fdjdt3f-shard-00-02.60chvjn.mongodb.net:27017/?ssl=true&replicaSet=atlas-sv13d6-shard-0&authSource=admin&retryWrites=true&w=majority";

// User Schema (inline to avoid import issues)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    role: {
        type: String,
        enum: ['super-admin', 'admin', 'client'],
        required: true
    },
    adminRole: { type: String },
    team: { type: String },
    teamId: { type: Number },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    permissions: [{ type: String }],
    performance: {
        activeTasks: { type: Number, default: 0 },
        completedTasks: { type: Number, default: 0 },
        clientSatisfaction: { type: String }
    },
    company: { type: String },
    plan: { type: String },
    status: {
        type: String,
        enum: ['active', 'pending', 'disabled'],
        default: 'active'
    },
    manager: { type: String },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    salesManager: { type: String },
    spCentralRequestId: { type: String },
    marketplace: { type: String },
    userPermission: { type: String },
    accountAccessUrl: { type: String },
    leadSource: { type: String },
    listingManager: { type: String },
    location: { type: String },
    subscribedServices: [{
        serviceId: { type: String },
        name: { type: String },
        subscribedDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' }
    }],
    joinedDate: { type: Date, default: Date.now },
    paymentMethods: [{
        brand: { type: String, default: 'Visa' },
        last4: { type: String },
        expiry: { type: String },
        cardholderName: { type: String },
        isDefault: { type: Boolean, default: false },
        providerId: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    notificationSettings: {
        soundEnabled: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true },
        taskUpdates: { type: Boolean, default: true },
        paymentAlerts: { type: Boolean, default: true },
        marketingNews: { type: Boolean, default: false },
        weeklyDigest: { type: Boolean, default: true }
    },
    pushSubscriptions: [{
        endpoint: { type: String, required: true },
        keys: {
            p256dh: { type: String, required: true },
            auth: { type: String, required: true }
        },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function setPasswordForAllUsers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully!\n');

        const newPassword = '123456';

        // Hash the password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(`Password hashed: ${hashedPassword.substring(0, 20)}...\n`);

        // Get total users
        const totalUsers = await User.countDocuments();
        console.log(`Total users in database: ${totalUsers}\n`);

        // Update all users with the new password
        console.log('Setting password "123456" for all users...');
        const result = await User.updateMany(
            {},
            { $set: { password: hashedPassword } }
        );

        console.log(`✓ Password updated for ${result.modifiedCount} users`);

        // Verify the update
        const usersWithPassword = await User.countDocuments({ password: { $exists: true, $ne: null } });
        console.log(`✓ Users with password: ${usersWithPassword}\n`);

        // Show sample of updated users
        console.log('=== Sample of updated users ===');
        const sampleUsers = await User.find().select('name email role').limit(10).lean();
        for (const user of sampleUsers) {
            console.log(`  ${user.email} (${user.role}) - Password set ✓`);
        }

        console.log('\n========================================');
        console.log('All users now have password: 123456');
        console.log('========================================');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB.');
    }
}

// Run the script
setPasswordForAllUsers();
