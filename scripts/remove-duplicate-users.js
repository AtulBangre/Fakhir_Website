/**
 * Script to find and remove duplicate users with the same email
 * 
 * This script will:
 * 1. Connect to MongoDB
 * 2. Find all users with duplicate emails (case-insensitive)
 * 3. Remove duplicates, keeping the oldest user (by createdAt) for each email
 * 4. Report what was deleted
 */

const mongoose = require('mongoose');

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

async function findAndRemoveDuplicateUsers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully!\n');

        // First check exact duplicates
        console.log('=== Checking for exact duplicate emails ===');

        const exactDuplicates = await User.aggregate([
            {
                $group: {
                    _id: { $toLower: '$email' },
                    count: { $sum: 1 },
                    users: { $push: '$_id' }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);

        if (exactDuplicates.length === 0) {
            console.log('No exact duplicate users found.\n');
        } else {
            console.log(`Found ${exactDuplicates.length} emails with duplicates:\n`);

            let totalDeleted = 0;

            for (const dup of exactDuplicates) {
                const emailLower = dup._id;
                const userIds = dup.users;
                const count = dup.count;

                console.log(`Email (lowercase): ${emailLower} - ${count} users`);

                // Get full user details to see which ones to keep
                const users = await User.find({ _id: { $in: userIds } })
                    .sort({ createdAt: 1 }) // Sort by creation date, oldest first
                    .lean();

                // Keep the first (oldest) user, remove the rest
                const usersToKeep = users[0];
                const usersToDelete = users.slice(1);

                console.log(`  Keeping: ${usersToKeep.name} (${usersToKeep.email}) - Created: ${usersToKeep.createdAt}`);

                for (const user of usersToDelete) {
                    console.log(`  Deleting: ${user.name} (${user.email}) - Created: ${user.createdAt}`);
                    await User.findByIdAndDelete(user._id);
                    totalDeleted++;
                }
                console.log('');
            }

            console.log('========================================');
            console.log(`Total duplicate users removed: ${totalDeleted}`);
            console.log('========================================\n');
        }

        // Also show total user count for reference
        const totalUsers = await User.countDocuments();
        console.log(`Total users in database: ${totalUsers}`);

        // Show some sample users for verification
        console.log('\n=== Sample users in database ===');
        const sampleUsers = await User.find().select('name email role createdAt').limit(10).lean();
        for (const user of sampleUsers) {
            console.log(`  ${user.email} (${user.role}) - Created: ${user.createdAt}`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB.');
    }
}

// Run the script
findAndRemoveDuplicateUsers();
