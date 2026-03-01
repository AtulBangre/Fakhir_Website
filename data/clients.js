// Clients Collection
// Master client list with normalized schema
export const clients = [
    {
        id: 1,
        name: "John Doe",
        company: "TechGadgets Co",
        email: "john@techgadgets.com",
        phone: "+1 (555) 123-4567",
        plan: "Premium",
        activeTasks: 3,
        status: "active",
        manager: "Sarah Mitchell",
        managerId: 1,
        joinedDate: "Jan 15, 2026",
        salesManager: "David Sales",
        spCentralRequestId: "REQ-1001",
        marketplace: "Amazon US",
        userPermission: "Full Access",
        accountAccessUrl: "https://sellercentral.amazon.com",
        leadSource: "LinkedIn",
        listingManager: "Emily Listings",
        location: "New York, USA"
    },
    {
        id: 2,
        name: "Emily Smith",
        company: "BeautyBrand Inc",
        email: "emily@beautybrand.com",
        phone: "+1 (555) 234-5678",
        plan: "Platinum",
        activeTasks: 2,
        status: "active",
        manager: "Sarah Mitchell",
        managerId: 1,
        joinedDate: "Dec 20, 2025",
        salesManager: "David Sales",
        spCentralRequestId: "REQ-1002",
        marketplace: "Amazon US",
        userPermission: "Full Access",
        accountAccessUrl: "https://sellercentral.amazon.com",
        leadSource: "Referral",
        listingManager: "Emily Listings",
        location: "Los Angeles, USA"
    },
    {
        id: 3,
        name: "Michael Brown",
        company: "HomeEssentials",
        email: "michael@homeessentials.com",
        phone: "+1 (555) 345-6789",
        plan: "Elite",
        activeTasks: 1,
        status: "active",
        manager: "Sarah Mitchell",
        managerId: 1,
        joinedDate: "Jan 10, 2026",
        salesManager: "David Sales",
        spCentralRequestId: "REQ-1003",
        marketplace: "Amazon US",
        userPermission: "Full Access",
        accountAccessUrl: "https://sellercentral.amazon.com",
        leadSource: "Website",
        listingManager: "Emily Listings",
        location: "Chicago, USA"
    },
    {
        id: 4,
        name: "Lisa Chen",
        company: "Fashion Forward",
        email: "lisa@fashion.com",
        phone: "+1 (555) 456-7890",
        plan: "Platinum",
        activeTasks: 0,
        status: "pending",
        manager: "Unassigned",
        managerId: null,
        joinedDate: "Jan 19, 2026",
        salesManager: null,
        spCentralRequestId: "REQ-1004",
        marketplace: "Amazon US",
        userPermission: "Pending",
        accountAccessUrl: null,
        leadSource: "Cold Outreach",
        listingManager: null,
        location: "San Francisco, USA"
    },
    {
        id: 5,
        name: "Robert Kim",
        company: "Tech Innovators",
        email: "robert@tech.com",
        phone: "+1 (555) 567-8901",
        plan: "Elite",
        activeTasks: 2,
        status: "active",
        manager: "John Anderson",
        managerId: 2,
        joinedDate: "Jan 18, 2026",
        salesManager: "David Sales",
        spCentralRequestId: "REQ-1005",
        marketplace: "Amazon US",
        userPermission: "Full Access",
        accountAccessUrl: "https://sellercentral.amazon.com",
        leadSource: "LinkedIn",
        listingManager: "Emily Listings",
        location: "Seattle, USA"
    },
    {
        id: 6,
        name: "Amanda White",
        company: "Sports Gear Pro",
        email: "amanda@sports.com",
        phone: "+1 (555) 678-9012",
        plan: "Premium",
        activeTasks: 1,
        status: "active",
        manager: "Emma Wilson",
        managerId: 3,
        joinedDate: "Jan 5, 2026",
        salesManager: "David Sales",
        spCentralRequestId: "REQ-1006",
        marketplace: "Amazon US",
        userPermission: "Full Access",
        accountAccessUrl: "https://sellercentral.amazon.com",
        leadSource: "Referral",
        listingManager: "Emily Listings",
        location: "Miami, USA"
    },
    {
        id: 7,
        name: "Alex Turner",
        company: "Digital Goods LLC",
        email: "mauryatech7@gmail.com",
        phone: "+1 (555) 789-0123",
        plan: "Premium",
        activeTasks: 2,
        status: "active",
        manager: "Sarah Mitchell",
        managerId: 1,
        joinedDate: "Jan 20, 2026",
        salesManager: "David Sales",
        spCentralRequestId: "REQ-1007",
        marketplace: "Amazon US",
        userPermission: "Full Access",
        accountAccessUrl: "https://sellercentral.amazon.com",
        leadSource: "Website",
        listingManager: "Emily Listings",
        location: "Austin, USA"
    },
];

export const getClientsByManager = (managerName) => {
    return clients.filter(c => c.manager === managerName);
};

export const getClientsByManagerId = (managerId) => {
    return clients.filter(c => c.managerId === managerId);
};

export const getUnassignedClients = () => {
    return clients.filter(c => c.manager === "Unassigned");
};

export const getClientById = (id) => {
    return clients.find(c => c.id === id);
};

// Derive recent clients (sorted by joinedDate, newest first)
export const getRecentClients = (limit = 3) => {
    return [...clients]
        .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
        .slice(0, limit);
};
