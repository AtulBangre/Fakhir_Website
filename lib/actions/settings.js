'use server';

import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
    await connectDB();
    try {
        let settings = await Settings.findOne({}).lean();
        if (!settings) {
            // Create default settings if none exist
            settings = await Settings.create({});
        }
        return JSON.parse(JSON.stringify(settings));
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

export async function updateSettings(data) {
    await connectDB();
    try {
        const settings = await Settings.findOneAndUpdate({}, data, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }).lean();

        revalidatePath('/super-admin/dashboard');
        return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
    } catch (error) {
        console.error('Error updating settings:', error);
        return { success: false, error: error.message };
    }
}
