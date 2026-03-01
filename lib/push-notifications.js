import webpush from 'web-push';
import User from '@/models/User';
import connectDB from './mongodb';

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || 'mailto:support@mauryatechnologies.com',
        publicVapidKey,
        privateVapidKey
    );
}

export async function sendPushNotification(userId, { title, message, url, icon }) {
    await connectDB();

    const user = await User.findById(userId);
    if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
        return { success: false, reason: 'No active push subscriptions for user' };
    }

    const payload = JSON.stringify({
        title,
        body: message,
        url: url || '/',
        icon: icon || '/favicon.ico'
    });

    const results = await Promise.allSettled(
        user.pushSubscriptions.map(subscription =>
            webpush.sendNotification(subscription, payload)
        )
    );

    // Clean up expired subscriptions
    const expiredSubscriptions = results
        .filter(res => res.status === 'rejected' && (res.reason.statusCode === 410 || res.reason.statusCode === 404))
        .map((res, index) => user.pushSubscriptions[index].endpoint);

    if (expiredSubscriptions.length > 0) {
        await User.findByIdAndUpdate(userId, {
            $pull: {
                pushSubscriptions: { endpoint: { $in: expiredSubscriptions } }
            }
        });
    }

    return {
        success: results.some(res => res.status === 'fulfilled'),
        results
    };
}
