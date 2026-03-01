"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    X,
    Check,
    CheckCheck,
    Settings,
    Trash2,
    UserPlus,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Users,
    ClipboardList,
    MessageSquare,
    FileText,
    RefreshCw,
    CreditCard,
    Volume2,
    VolumeX,
    Mail,
    Smartphone,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap = {
    UserPlus,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Users,
    ClipboardList,
    MessageSquare,
    FileText,
    RefreshCw,
    CreditCard,
};

import { ScrollableContainer } from "@/components/ui/scrollable-container";

export default function NotificationDropdown({
    notifications = [],
    settings = {},
    onSettingsChange,
    onMarkAsRead,
    onMarkAllAsRead,
    onDelete,
    onClearAll,
    onNotificationClick,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [localSettings, setLocalSettings] = useState({
        soundEnabled: true,
        emailNotifications: true,
        pushNotifications: true,
        taskUpdates: true,
        paymentAlerts: true,
        marketingNews: false,
        weeklyDigest: true,
        ...settings,
    });
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter((n) => !(n.read || n.isRead)).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen]);

    const handleSettingChange = (key, value) => {
        const newSettings = { ...localSettings, [key]: value };
        setLocalSettings(newSettings);
        onSettingsChange?.(newSettings);
    };

    // Auto-delete read notifications after 10 seconds
    useEffect(() => {
        const readNotifications = notifications.filter(n => n.read || n.isRead);
        if (readNotifications.length === 0) return;

        const timers = readNotifications.map(notification => {
            return setTimeout(() => {
                onDelete?.(notification._id);
            }, 10000);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [notifications, onDelete]);

    const handleMarkAsRead = useCallback((id) => {
        onMarkAsRead?.(id);
    }, [onMarkAsRead]);

    const handleDelete = useCallback((id) => {
        onDelete?.(id);
    }, [onDelete]);

    const handleNotificationClick = useCallback((notification) => {
        // Mark as read first
        if (!(notification.read || notification.isRead)) {
            onMarkAsRead?.(notification._id);
        }
        // Call the click handler with the notification
        onNotificationClick?.(notification);
        // Close dropdown
        setIsOpen(false);
    }, [onMarkAsRead, onNotificationClick]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative p-2.5 rounded-xl transition-all duration-200",
                    isOpen
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted/50 hover:bg-muted text-foreground"
                )}
            >
                <Bell className="h-5 w-5" />

                {/* Notification Badge */}
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs font-bold rounded-full shadow-lg"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Pulse Animation */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full animate-ping opacity-75" />
                )}
            </motion.button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-card rounded-2xl border border-border shadow-2xl z-50 flex flex-col"
                        style={{ maxHeight: "520px" }}
                    >
                        {/* Header — fixed, never scrolls */}
                        <div className="px-4 py-3 bg-muted/30 border-b border-border rounded-t-2xl flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold text-base">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs — fixed, never scrolls */}
                        <div className="px-4 pt-2 border-b border-border flex-shrink-0">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={cn(
                                        "px-0 pb-2 pt-1 border-b-2 text-sm font-medium transition-colors",
                                        activeTab === "all"
                                            ? "border-primary text-foreground"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setActiveTab("settings")}
                                    className={cn(
                                        "px-0 pb-2 pt-1 border-b-2 text-sm font-medium transition-colors flex items-center gap-1",
                                        activeTab === "settings"
                                            ? "border-primary text-foreground"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </button>
                            </div>
                        </div>

                        {/* Scrollable content area */}
                        {activeTab === "all" && (
                            <>
                                <ScrollableContainer maxHeight="360px">
                                    {notifications.length > 0 ? (
                                        <div className="divide-y divide-border">
                                            {notifications.map((notification, index) => (
                                                <NotificationItem
                                                    key={notification._id}
                                                    notification={notification}
                                                    onMarkAsRead={handleMarkAsRead}
                                                    onDelete={handleDelete}
                                                    onClick={handleNotificationClick}
                                                    index={index}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState />
                                    )}
                                </ScrollableContainer>

                                {/* Footer — fixed at bottom */}
                                {notifications.length > 0 && (
                                    <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between flex-shrink-0 rounded-b-2xl">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={onMarkAllAsRead}
                                            className="text-xs gap-1.5"
                                        >
                                            <CheckCheck className="h-3.5 w-3.5" />
                                            Mark all as read
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={onClearAll}
                                            className="text-xs text-muted-foreground hover:text-destructive gap-1.5"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Clear all
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === "settings" && (
                            <ScrollableContainer className="rounded-b-2xl" maxHeight="360px">
                                <div className="p-4 space-y-4">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                        Preferences
                                    </h4>

                                    <SettingItem
                                        icon={Volume2}
                                        iconOff={VolumeX}
                                        label="Sound alerts"
                                        description="Play sound for new notifications"
                                        checked={localSettings.soundEnabled}
                                        onCheckedChange={(v) => handleSettingChange("soundEnabled", v)}
                                    />

                                    <SettingItem
                                        icon={Mail}
                                        label="Email notifications"
                                        description="Receive updates via email"
                                        checked={localSettings.emailNotifications}
                                        onCheckedChange={(v) => handleSettingChange("emailNotifications", v)}
                                    />

                                    <SettingItem
                                        icon={Smartphone}
                                        label="Push notifications"
                                        description="Browser push notifications"
                                        checked={localSettings.pushNotifications}
                                        onCheckedChange={(v) => handleSettingChange("pushNotifications", v)}
                                    />

                                    <div className="pt-4 border-t border-border">
                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                                            Notification Types
                                        </h4>

                                        <SettingItem
                                            icon={ClipboardList}
                                            label="Task updates"
                                            description="New tasks and status changes"
                                            checked={localSettings.taskUpdates}
                                            onCheckedChange={(v) => handleSettingChange("taskUpdates", v)}
                                        />

                                        <SettingItem
                                            icon={DollarSign}
                                            label="Payment alerts"
                                            description="Invoice and payment updates"
                                            checked={localSettings.paymentAlerts}
                                            onCheckedChange={(v) => handleSettingChange("paymentAlerts", v)}
                                        />

                                        <SettingItem
                                            icon={FileText}
                                            label="Weekly digest"
                                            description="Summary of weekly activity"
                                            checked={localSettings.weeklyDigest}
                                            onCheckedChange={(v) => handleSettingChange("weeklyDigest", v)}
                                        />

                                        <SettingItem
                                            icon={MessageSquare}
                                            label="Marketing & news"
                                            description="Product updates and offers"
                                            checked={localSettings.marketingNews}
                                            onCheckedChange={(v) => handleSettingChange("marketingNews", v)}
                                        />
                                    </div>
                                </div>
                            </ScrollableContainer>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Notification Item Component
function NotificationItem({ notification, onMarkAsRead, onDelete, onClick, index }) {
    const Icon = iconMap[notification.icon] || Bell;
    const isRead = notification.read || notification.isRead;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onClick?.(notification)}
            className={cn(
                "group relative p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                !isRead && "bg-primary/5"
            )}
        >
            <div className="flex gap-3">
                {/* Icon */}
                <div
                    className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                        notification.type === 'success' ? "bg-emerald-500/10 text-emerald-500" :
                            notification.type === 'warning' ? "bg-amber-500/10 text-amber-500" :
                                notification.type === 'error' ? "bg-red-500/10 text-red-500" :
                                    notification.type === 'task' ? "bg-violet-500/10 text-violet-500" :
                                        notification.type === 'invoice' ? "bg-cyan-500/10 text-cyan-500" :
                                            "bg-blue-500/10 text-blue-500"
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                            "text-sm font-medium leading-tight",
                            !isRead && "text-foreground",
                            isRead && "text-muted-foreground"
                        )}>
                            {notification.title}
                        </p>
                        {!isRead && (
                            <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5" />
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1.5">
                        {notification.createdAt
                            ? new Date(notification.createdAt).toLocaleString()
                            : notification.time || ""}
                    </p>
                </div>
            </div>

            {/* Hover Actions */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-card shadow-sm rounded-lg p-1 border border-border">
                {!isRead && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification._id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                        title="Mark as read"
                    >
                        <Check className="h-3.5 w-3.5" />
                    </button>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification._id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    title="Delete"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </motion.div>
    );
}

// Setting Item Component
function SettingItem({ icon: Icon, iconOff: IconOff, label, description, checked, onCheckedChange }) {
    const DisplayIcon = checked ? Icon : (IconOff || Icon);

    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    checked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                    <DisplayIcon className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}

// Empty State Component
function EmptyState({ message = "No notifications yet" }) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-12 px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground text-center">{message}</p>
        </div>
    );
}
