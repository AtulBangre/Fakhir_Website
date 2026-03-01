'use server';

import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { sendPushNotification } from '@/lib/push-notifications';
import { sendEmail, emailTemplates } from '@/lib/mail';

export async function getNotifications({ recipientId, limit = 50 }) {
    try {
        await connectDB();
        const notifications = await Notification.find({ recipientId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return JSON.parse(JSON.stringify(notifications));
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

export async function createNotification({ recipientId, title, message, type = 'info', link = '#', icon, skipEmail = false, skipPush = false }) {
    try {
        await connectDB();
        // Auto-assign icon based on type if not explicitly provided
        const typeIconMap = {
            task: 'ClipboardList',
            invoice: 'CreditCard',
            success: 'CheckCircle',
            warning: 'AlertTriangle',
            error: 'AlertTriangle',
            info: 'MessageSquare',
        };
        const resolvedIcon = icon || typeIconMap[type] || 'MessageSquare';

        const notification = await Notification.create({
            recipientId,
            title,
            message,
            type,
            icon: resolvedIcon,
            link
        });

        // Trigger push and email notifications if recipient exists
        try {
            const User = (await import('@/models/User')).default;
            const recipient = await User.findById(recipientId);

            if (recipient) {
                const rolePathMap = {
                    'admin': '/admin/dashboard',
                    'client': '/client/dashboard',
                    'super-admin': '/super-admin/dashboard'
                };
                const basePath = rolePathMap[recipient.role] || '';
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                const fullLink = link.startsWith('http')
                    ? link
                    : (link.startsWith('/') ? `${appUrl}${link}` : `${appUrl}${basePath}${link.startsWith('#') ? link : '/' + link}`);

                // Check user preferences
                const settings = recipient.notificationSettings || { emailNotifications: true, pushNotifications: true };

                // 1. Trigger Push Notification (only if enabled in settings and not skipped)
                if (!skipPush && settings.pushNotifications !== false) {
                    await sendPushNotification(recipientId, {
                        title,
                        message,
                        url: fullLink,
                        icon: resolvedIcon === 'ClipboardList' ? '/icons/task.png' : '/favicon.ico'
                    });
                }

                // 2. Trigger Email Notification (only if enabled in settings and not skipped)
                if (recipient.email && !skipEmail && settings.emailNotifications !== false) {
                    const emailContent = emailTemplates.notification({
                        title,
                        message,
                        link: fullLink
                    });

                    await sendEmail({
                        to: recipient.email,
                        ...emailContent
                    });
                    console.log(`[Notification] Email sent to ${recipient.email}`);
                }
            }
        } catch (notifierError) {
            console.error('Push/Email notification failed:', notifierError);
            // Don't fail the entire operation if push or email fails
        }

        return JSON.parse(JSON.stringify(notification));
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
}

export async function markNotificationAsRead(notificationId) {
    try {
        await connectDB();
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        return { success: true };
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return { success: false };
    }
}

export async function markAllNotificationsAsRead(recipientId) {
    try {
        await connectDB();
        await Notification.updateMany({ recipientId, read: false }, { read: true });
        return { success: true };
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return { success: false };
    }
}

export async function deleteNotification(notificationId) {
    try {
        await connectDB();
        await Notification.findByIdAndDelete(notificationId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting notification:', error);
        return { success: false };
    }
}

export async function clearAllNotifications(recipientId) {
    try {
        await connectDB();
        await Notification.deleteMany({ recipientId });
        return { success: true };
    } catch (error) {
        console.error('Error clearing notifications:', error);
        return { success: false };
    }
}
