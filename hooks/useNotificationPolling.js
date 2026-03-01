"use client";

import { useEffect, useRef, useCallback } from "react";
import { getNotifications } from "@/lib/actions/notification";

/**
 * Polls for notifications at a given interval and calls `onUpdate`
 * only when the data has actually changed.
 *
 * @param {Object}   options
 * @param {string}   options.recipientId   – the user's _id
 * @param {number}   options.limit         – max notifications to fetch (default 20)
 * @param {number}   options.interval      – polling interval in ms (default 10 000)
 * @param {Function} options.onUpdate      – called with the new array when data changes
 * @param {boolean}  options.enabled       – set to false to pause polling
 */
export default function useNotificationPolling({
    recipientId,
    limit = 20,
    interval = 10_000,
    onUpdate,
    enabled = true,
}) {
    const prevSnapshotRef = useRef("");
    const timerRef = useRef(null);
    const isMountedRef = useRef(true);

    // Build a lightweight "snapshot" string from an array of notifications
    // so we can compare cheaply without deep-equal.
    const snapshot = useCallback((notifications) => {
        return notifications
            .map((n) => `${n._id}:${n.read ? 1 : 0}`)
            .join("|");
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!recipientId) return;
        try {
            const data = await getNotifications({ recipientId, limit });
            if (!isMountedRef.current) return;

            const newSnap = snapshot(data || []);
            if (newSnap !== prevSnapshotRef.current) {
                prevSnapshotRef.current = newSnap;
                onUpdate?.(data || []);
            }
        } catch (error) {
            console.error("Notification poll error:", error);
        }
    }, [recipientId, limit, snapshot, onUpdate]);

    useEffect(() => {
        isMountedRef.current = true;

        if (!enabled || !recipientId) return;

        // Initial fetch
        fetchNotifications();

        // Set up interval
        timerRef.current = setInterval(fetchNotifications, interval);

        // Pause when tab is hidden, resume when visible
        const handleVisibility = () => {
            if (document.hidden) {
                clearInterval(timerRef.current);
            } else {
                // Fetch immediately when tab becomes visible again
                fetchNotifications();
                timerRef.current = setInterval(fetchNotifications, interval);
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            isMountedRef.current = false;
            clearInterval(timerRef.current);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [enabled, recipientId, interval, fetchNotifications]);
}
