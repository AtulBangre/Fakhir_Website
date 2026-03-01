// Tasks Collection
// Normalized schema — every task has all fields
export const allTasks = [
    {
        id: 1,
        clientId: 1,
        title: "PPC Campaign Setup",
        client: "John Doe",
        manager: "Sarah Mitchell",
        managerId: 1,
        service: "PPC Management",
        priority: "High",
        status: "in-progress",
        eta: "Jan 25, 2026",
        dueDate: "Jan 25, 2026",
        completedDate: null,
        owner: "Sarah Mitchell",
        description: "Set up and optimize PPC campaigns for product launch",
        planForWeek: "6",
        isHighPriority: true,
        isCompleted: false,
        lastUpdated: "2 hours ago"
    },
    {
        id: 2,
        clientId: 1,
        title: "Listing Optimization - Product A",
        client: "John Doe",
        manager: "Sarah Mitchell",
        managerId: 1,
        service: "Catalog Management",
        priority: "Low",
        status: "completed",
        eta: "Jan 20, 2026",
        dueDate: "Jan 20, 2026",
        completedDate: "Jan 19, 2026",
        owner: "Sarah Mitchell",
        description: "Optimize product listings for better visibility",
        planForWeek: "5",
        isHighPriority: false,
        isCompleted: true,
        lastUpdated: "2 days ago"
    },
    {
        id: 3,
        clientId: 2,
        title: "A+ Content Design - Product B",
        client: "Emily Smith",
        manager: "Sarah Mitchell",
        managerId: 1,
        service: "A+ Content",
        priority: "Medium",
        status: "in-progress",
        eta: "Jan 28, 2026",
        dueDate: "Jan 28, 2026",
        completedDate: null,
        owner: "Sarah Mitchell",
        description: "Design A+ content for product B",
        planForWeek: "7",
        isHighPriority: false,
        isCompleted: false,
        lastUpdated: "5 hours ago"
    },
    {
        id: 4,
        clientId: 3,
        title: "Brand Registry Application",
        client: "Michael Brown",
        manager: "Sarah Mitchell",
        managerId: 1,
        service: "Brand Registry",
        priority: "High",
        status: "pending",
        eta: "Feb 1, 2026",
        dueDate: "Feb 1, 2026",
        completedDate: null,
        owner: "John Anderson",
        description: "Apply for Amazon Brand Registry",
        planForWeek: "6",
        isHighPriority: true,
        isCompleted: false,
        lastUpdated: "1 day ago"
    },
    {
        id: 5,
        clientId: 1,
        title: "Competitor Analysis Report",
        client: "John Doe",
        manager: "Sarah Mitchell",
        managerId: 1,
        service: "Account Management",
        priority: "Low",
        status: "completed",
        eta: "Jan 15, 2026",
        dueDate: "Jan 14, 2026",
        completedDate: "Jan 14, 2026",
        owner: "Sarah Mitchell",
        description: "Analyze top competitors and provide recommendations",
        planForWeek: "3",
        isHighPriority: false,
        isCompleted: true,
        lastUpdated: "5 days ago"
    },
    {
        id: 6,
        clientId: 2,
        title: "Backend Search Terms Update",
        client: "Emily Smith",
        manager: "Sarah Mitchell",
        managerId: 1,
        service: "Catalog Management",
        priority: "Medium",
        status: "completed",
        eta: "Jan 12, 2026",
        dueDate: "Jan 12, 2026",
        completedDate: "Jan 12, 2026",
        owner: "Sarah Mitchell",
        description: "Update backend search terms for improved discoverability",
        planForWeek: "4",
        isHighPriority: false,
        isCompleted: true,
        lastUpdated: "7 days ago"
    },
    {
        id: 7,
        clientId: 5,
        title: "Listing Optimization",
        client: "Robert Kim",
        manager: "John Anderson",
        managerId: 2,
        service: "Catalog Management",
        priority: "Low",
        status: "completed",
        eta: "Jan 20, 2026",
        dueDate: "Jan 20, 2026",
        completedDate: "Jan 19, 2026",
        owner: "John Anderson",
        description: "Optimize product listings for better search ranking",
        planForWeek: "5",
        isHighPriority: false,
        isCompleted: true,
        lastUpdated: "2 days ago"
    },
    {
        id: 8,
        clientId: 6,
        title: "Account Audit",
        client: "Amanda White",
        manager: "Emma Wilson",
        managerId: 3,
        service: "Account Management",
        priority: "Medium",
        status: "completed",
        eta: "Jan 18, 2026",
        dueDate: "Jan 18, 2026",
        completedDate: "Jan 17, 2026",
        owner: "Emma Wilson",
        description: "Comprehensive audit of seller account health and performance",
        planForWeek: "5",
        isHighPriority: false,
        isCompleted: true,
        lastUpdated: "4 days ago"
    },
];

export const getTasksByClient = (clientName) => {
    return allTasks.filter(t => t.client === clientName);
};

export const getTasksByClientId = (clientId) => {
    return allTasks.filter(t => t.clientId === clientId);
};

export const getTasksByManager = (managerName) => {
    return allTasks.filter(t => t.manager === managerName);
};

export const getTasksByManagerId = (managerId) => {
    return allTasks.filter(t => t.managerId === managerId);
};

export const getRecentTasksByManager = (managerName, limit = 4) => {
    return allTasks
        .filter(t => t.manager === managerName)
        .slice(0, limit);
};
