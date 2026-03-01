// Dashboard Data Collection (computed/aggregated data)
import { clients } from './clients';
import { admins } from './admins';

// Super Admin Dashboard Stats
export const superAdminStats = [
    {
        title: "Total Clients",
        value: clients.length,
        icon: "Users",
        trend: { value: "+12 this month", positive: true }
    },
    {
        title: "Active Plans",
        value: clients.filter(c => c.status === "active").length,
        icon: "CheckSquare"
    },
    {
        title: "Total Revenue",
        value: "₹2.85Cr", // Mock value updated to INR style if needed, or just ₹ value
        icon: "IndianRupee",
        trend: { value: "+18% vs last month", positive: true }
    },
    {
        title: "Unassigned Clients",
        value: clients.filter(c => c.manager === "Unassigned").length,
        icon: "AlertTriangle"
    },
];

// Admin Dashboard Stats - Helper to generate dynamic stats
export const getAdminDashboardStats = (adminId) => {
    // In a real app this would query tasks/clients for this admin
    return {
        totalClients: clients.filter(c => c.managerId === adminId).length,
        activeTasks: 4, // Placeholder - would filter tasks
        pendingTasks: 1, // Placeholder
        completedThisWeek: 8 // Placeholder
    };
};

export const adminDashboardStats = getAdminDashboardStats(1); // Default for demo

// Client Dashboard Info - Helper to generate dynamic client info
export const getClientDashboardInfo = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return null;

    const manager = admins.find(a => a.id === client.managerId);

    return {
        clientName: client.name.split(' ')[0],
        activePlan: client.plan,
        planValidUntil: "Mar 15, 2026", // Mock data
        activeTasks: client.activeTasks,
        completedTasks: 12, // Mock data
        accountManager: manager ? {
            name: manager.name,
            role: manager.role,
            email: manager.email,
            initials: manager.name.split(' ').map(n => n[0]).join('')
        } : null
    };
};

export const clientDashboardInfo = getClientDashboardInfo(1); // Default for demo

// Plan details for client
export const clientPlanDetails = {
    name: "Premium",
    price: 1999,
    startDate: "Dec 15, 2025",
    validUntil: "Mar 15, 2026",
    daysRemaining: 52
};

// Billing summary
export const billingSummary = {
    currentPlan: "Premium",
    monthlyRate: 20000,
    nextPaymentDate: "Feb 15, 2026",
    nextPaymentAmount: 20000,
    totalPaid: 60000,
    invoiceCount: 3,
    paymentMethod: {
        type: "VISA",
        last4: "4242",
        expiry: "12/2027"
    }
};

// Recent clients - mapped from source
export const recentClients = clients
    .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
    .slice(0, 3)
    .map(client => ({
        id: client.id,
        name: client.name,
        company: client.company,
        plan: client.plan,
        assignedTo: client.manager,
        date: client.joinedDate
    }));
