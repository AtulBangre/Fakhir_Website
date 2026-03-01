'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function saveSubscription(userId, subscription) {
    if (!userId || !subscription) {
        console.error('saveSubscription missing data:', { userId, subscription });
        return { success: false, error: 'Missing data' };
    }

    await connectDB();
    try {
        // Find user and check if subscription already exists
        const user = await User.findById(userId);
        if (!user) {
            console.error('saveSubscription user not found:', userId);
            return { success: false, error: 'User not found' };
        }

        console.log('Saving subscription for user:', user.email);
        if (!user.pushSubscriptions) {
            user.pushSubscriptions = [];
        }

        const exists = user.pushSubscriptions.some(sub => sub.endpoint === subscription.endpoint);

        if (!exists) {
            await User.findByIdAndUpdate(userId, {
                $push: { pushSubscriptions: subscription }
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error saving push subscription:', error);
        return { success: false, error: error.message };
    }
}

export async function removeSubscription(userId, endpoint) {
    if (!userId || !endpoint) return { success: false, error: 'Missing data' };

    await connectDB();
    try {
        await User.findByIdAndUpdate(userId, {
            $pull: { pushSubscriptions: { endpoint } }
        });
        return { success: true };
    } catch (error) {
        console.error('Error removing push subscription:', error);
        return { success: false, error: error.message };
    }
}
