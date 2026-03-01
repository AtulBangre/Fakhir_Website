// Admin Users Collection
// Centralized comprehensive admin/manager data
export const admins = [
    {
        id: 1,
        name: "Sarah Mitchell",
        email: "k6263638053@gmail.com",
        role: "Account Manager",
        team: "Marketing Team", // Denormalized for easy access
        teamId: 1,
        clients: 3,
        phone: "+1 (555) 123-4567",
        status: "active",
        joinedDate: "Jan 2024",
        performance: {
            activeTasks: 4,
            completedTasks: 47,
            clientSatisfaction: "98%"
        },
        permissions: ["read", "write", "manage_clients"]
    },
    {
        id: 2,
        name: "John Anderson",
        email: "john@fakhriit.com",
        role: "Account Manager",
        team: "Marketing Team",
        teamId: 1,
        clients: 4,
        phone: "+1 (555) 234-5678",
        status: "active",
        joinedDate: "Mar 2024",
        performance: {
            activeTasks: 6,
            completedTasks: 52,
            clientSatisfaction: "95%"
        },
        permissions: ["read", "write", "manage_clients"]
    },
    {
        id: 3,
        name: "Emma Wilson",
        email: "emma@fakhriit.com",
        role: "Senior Manager",
        team: "Enterprise Team",
        teamId: 2,
        clients: 2,
        phone: "+1 (555) 345-6789",
        status: "active",
        joinedDate: "Feb 2023",
        performance: {
            activeTasks: 3,
            completedTasks: 38,
            clientSatisfaction: "99%"
        },
        permissions: ["read", "write", "manage_clients", "manage_teams"]
    },
    {
        id: 4,
        name: "David Lee",
        email: "david@fakhriit.com",
        role: "Account Manager",
        team: "Enterprise Team",
        teamId: 2,
        clients: 3,
        status: "active",
        joinedDate: "Jun 2024",
        performance: {
            activeTasks: 5,
            completedTasks: 22,
            clientSatisfaction: "96%"
        },
        permissions: ["read", "write", "manage_clients"]
    },
    {
        id: 5,
        name: "Michael Chen",
        email: "michael@fakhriit.com",
        role: "Team Lead",
        team: "Growth Team",
        teamId: 3,
        clients: 3,
        phone: "+1 (555) 567-8901",
        status: "disabled", // previously 'enabled: false'
        joinedDate: "Sep 2023",
        performance: {
            activeTasks: 0,
            completedTasks: 85,
            clientSatisfaction: "97%"
        },
        permissions: ["read", "write", "manage_clients"]
    },
];

// Helper to get formatted list of manager names for dropdowns
export const getManagerNames = () => admins.map(admin => admin.name);

// Alias for backward compatibility (formerly managerNames)
export const managerNames = getManagerNames();

// Mock function to get the currently logged-in admin
// In a real app, this would come from the auth session
export const getCurrentAdmin = () => {
    return admins[0];
};

// Get stats for a specific admin profile
export const getAdminStats = (adminId) => {
    const admin = admins.find(a => a.id === adminId);
    if (!admin) return null;
    return {
        assignedClients: admin.clients,
        ...admin.performance
    };
};
