import { admins } from './admins.js';

// Calculate client count dynamically or keep it static if mocking DB
const getAdminsByTeam = (teamId) => admins.filter(admin => admin.teamId === teamId);

export const teams = [
    {
        id: 1,
        name: "Marketing Team",
        description: "Focuses on PPC, SEO, and Marketing strategies",
        lead: "Sarah Mitchell", // String for display
        leadId: 1, // Reference to admins.id
        clientCount: 7,
        memberIds: [1, 2], // Sarah, John
        status: "active"
    },
    {
        id: 2,
        name: "Enterprise Team",
        description: "Handles large-scale enterprise clients",
        lead: "Emma Wilson",
        leadId: 3,
        clientCount: 5,
        memberIds: [3, 4], // Emma, David
        status: "active"
    },
    {
        id: 3,
        name: "Growth Team",
        description: "Specialized in rapid growth and scaling",
        lead: "Michael Chen",
        leadId: 5,
        clientCount: 3,
        memberIds: [5], // Michael
        status: "active"
    },
];

// Helper to get members of a team
export const getTeamMembers = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return [];
    return admins.filter(admin => team.memberIds.includes(admin.id));
};
