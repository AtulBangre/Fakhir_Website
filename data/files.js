// Client Files Collection
// Linked to clients via clientId
export const files = [
    {
        id: 1,
        name: "Product A - A+ Content Final.pdf",
        clientId: 1,
        client: "John Doe",
        type: "pdf",
        size: "2.4 MB",
        version: "v2.0",
        uploadedBy: "Sarah Mitchell",
        date: "Jan 19, 2026"
    },
    {
        id: 2,
        name: "PPC Campaign Report - Week 3.xlsx",
        clientId: 1,
        client: "John Doe",
        type: "excel",
        size: "856 KB",
        version: "v1.0",
        uploadedBy: "Sarah Mitchell",
        date: "Jan 18, 2026"
    },
    {
        id: 3,
        name: "Product Images - Main.zip",
        clientId: 2,
        client: "Emily Smith",
        type: "image",
        size: "15.2 MB",
        version: "v2.0",
        uploadedBy: "Design Team",
        date: "Jan 15, 2026"
    },
    {
        id: 4,
        name: "Competitor Analysis Report.pdf",
        clientId: 1,
        client: "John Doe",
        type: "pdf",
        size: "1.8 MB",
        version: "v1.0",
        uploadedBy: "Sarah Mitchell",
        date: "Jan 14, 2026"
    },
    {
        id: 5,
        name: "Brand Guidelines.pdf",
        clientId: 2,
        client: "Emily Smith",
        type: "pdf",
        size: "4.2 MB",
        version: "v1.0",
        uploadedBy: "Design Team",
        date: "Jan 10, 2026"
    },
];

export const getFilesByClient = (clientName) => {
    return files.filter(f => f.client === clientName);
};

export const getFilesByClientId = (clientId) => {
    return files.filter(f => f.clientId === clientId);
};
