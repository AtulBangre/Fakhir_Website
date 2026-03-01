'use client';

import { useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function PushNotificationManager({ userId, settings }) {
    const { subscribeUser, isSupported, permission } = usePushNotifications(userId);

    useEffect(() => {
        // If pushNotifications is enabled in settings and we don't have permission yet
        if (settings?.pushNotifications && isSupported && permission === 'default') {
            // We can't automatically call subscribeUser because it needs a user gesture usually
            // But we can check if they've already granted it in the past
            if (Notification.permission === 'granted') {
                subscribeUser();
            }
        }
    }, [settings?.pushNotifications, isSupported, permission, subscribeUser]);

    return null; // This component doesn't render anything
}
