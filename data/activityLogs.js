// Activity Log Collection
export const activityLogs = [
    { id: 1, action: "Task completed", user: "Sarah Mitchell", adminId: 1, task: "Listing Optimization", taskId: 2, type: "task", time: "2 hours ago", timestamp: "2026-01-19T14:00:00Z" },
    { id: 2, action: "Status updated", user: "John Anderson", adminId: 2, task: "PPC Campaign Setup", taskId: 1, type: "task", time: "5 hours ago", timestamp: "2026-01-19T11:00:00Z" },
    { id: 3, action: "File uploaded", user: "Emma Wilson", adminId: 3, task: "Account Audit", taskId: 8, type: "file", time: "1 day ago", timestamp: "2026-01-18T10:00:00Z" },
    { id: 4, action: "Client assigned", user: "Sarah Mitchell", adminId: 1, task: "New Client Onboarding", taskId: null, type: "client", time: "2 days ago", timestamp: "2026-01-17T09:00:00Z" },
    { id: 5, action: "Note added", user: "John Anderson", adminId: 2, task: "PPC Campaign Setup", taskId: 1, type: "note", time: "3 days ago", timestamp: "2026-01-16T16:00:00Z" },
];

export const getActivityLogsByAdmin = (adminId) => {
    return activityLogs.filter(log => log.adminId === adminId);
};
