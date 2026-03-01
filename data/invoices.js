// Invoices Collection
// Linked to clients via clientId
export const invoices = [
    {
        id: "INV-2026-001",
        clientId: 1,
        client: "John Doe",
        date: "Jan 15, 2026",
        amount: "₹20,000",
        amountNumeric: 20000,
        plan: "Premium",
        status: "paid",
        dueDate: "Jan 15, 2026"
    },
    {
        id: "INV-2025-012",
        clientId: 1,
        client: "John Doe",
        date: "Dec 15, 2025",
        amount: "₹20,000",
        amountNumeric: 20000,
        plan: "Premium",
        status: "paid",
        dueDate: "Dec 15, 2025"
    },
    {
        id: "INV-2025-011",
        clientId: 1,
        client: "John Doe",
        date: "Nov 15, 2025",
        amount: "₹20,000",
        amountNumeric: 20000,
        plan: "Premium",
        status: "paid",
        dueDate: "Nov 15, 2025"
    },
];

export const getInvoicesByClientId = (clientId) => {
    return invoices.filter(inv => inv.clientId === clientId);
};

export const getBillingSummaryByClientId = (clientId) => {
    const clientInvoices = getInvoicesByClientId(clientId);
    const totalPaid = clientInvoices
        .filter(inv => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.amountNumeric, 0);

    return {
        invoiceCount: clientInvoices.length,
        totalPaid,
        totalPaidFormatted: `₹${totalPaid.toLocaleString('en-IN')}`,
    };
};
