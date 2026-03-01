import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function updateEmails() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const updates = [
            { old: 'sarah@fakhriit.com', new: 'k6263638053@gmail.com', name: 'Admin (Sarah)' },
            { old: 'alex@digitalgoods.com', new: 'mauryatech7@gmail.com', name: 'Client (Alex)' }
        ];

        for (const update of updates) {
            console.log(`Checking for ${update.name}...`);

            // 1. Check if new email already exists
            const existingNew = await User.findOne({ email: update.new });
            if (existingNew) {
                console.log(`User with new email ${update.new} already exists. Skipping update for ${update.old}.`);
                continue;
            }

            // 2. Find old user and update
            const oldUser = await User.findOne({ email: update.old });
            if (oldUser) {
                await User.updateOne({ _id: oldUser._id }, { $set: { email: update.new } });
                console.log(`Successfully updated ${update.old} to ${update.new}`);
            } else {
                console.log(`User with email ${update.old} not found.`);
            }
        }

    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

updateEmails();
