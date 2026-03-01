'use server';

import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { numberToWordsIndian, getGSTDetails } from '@/lib/utils';

export async function getInvoices({
    page = 1,
    limit = 10,
    status = '',
    clientId = null,
    search = ''
} = {}) {
    await connectDB();
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (clientId) query['client.id'] = clientId;

    if (search) {
        query.$or = [
            { invoiceNumber: { $regex: search, $options: 'i' } },
            { 'client.name': { $regex: search, $options: 'i' } },
            { 'client.company': { $regex: search, $options: 'i' } }
        ];
    }

    try {
        const invoices = await Invoice.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Invoice.countDocuments(query);

        return {
            invoices: JSON.parse(JSON.stringify(invoices)),
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        };
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return { invoices: [], total: 0, pages: 0, error: 'Failed to fetch invoices' };
    }
}

export async function getInvoiceSummary(clientId) {
    await connectDB();
    try {
        const query = clientId ? { 'client.id': clientId } : {};
        const invoices = await Invoice.find(query).lean();

        let totalAmount = 0;
        invoices.forEach(inv => {
            if (inv.status === 'Paid') {
                const val = parseFloat(String(inv.amount).replace(/[^0-9.]/g, ''));
                if (!isNaN(val)) totalAmount += val;
            }
        });

        const paidCount = invoices.filter(inv => inv.status === 'Paid').length;
        const pendingCount = invoices.filter(inv => inv.status === 'Pending').length;

        // NOTE: In original code, totalAmount calculation included all invoices regardless of status?
        // Let's stick to calculating total of *all* for the summary if that's what was intended, 
        // BUT usually summary implies "Revenue" which is paid.
        // The previous implementation sum reduced ALL amounts. I will keep it consistent but improve parsing.

        // Re-implementing original logic roughly but safer
        const totalInvoiced = invoices.reduce((sum, inv) => {
            const val = parseFloat(String(inv.amount).replace(/[^0-9.]/g, ''));
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        return {
            totalAmount: totalInvoiced,
            count: invoices.length,
            paidCount,
            pendingCount
        };
    } catch (error) {
        console.error('Error calculating invoice summary:', error);
        return null;
    }
}

const SELLER_DETAILS = {
    name: 'Fakhri IT Services (India) Private Limited',
    address: '12B, Saeed Colony, Housing Board Karond',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462038',
    country: 'India',
    gstNo: '23AADCF5985D1ZO',
    stateCode: '23',
    email: 'info@fakhriitservices.com',
    phone: '+91 9876543210',
};

export async function createInvoice(invoiceData) {
    await connectDB();
    try {
        // 1. Generate Invoice Number: FISIPL2526INXXXX
        const prefix = "FISIPL2526IN";
        const latestInvoice = await Invoice.findOne({ invoiceNumber: new RegExp(`^${prefix}`) })
            .sort({ createdAt: -1 })
            .lean();

        let nextNum = 1;
        if (latestInvoice) {
            const lastNumStr = latestInvoice.invoiceNumber.replace(prefix, "");
            nextNum = parseInt(lastNumStr) + 1;
        }
        invoiceData.invoiceNumber = `${prefix}${String(nextNum).padStart(4, '0')}`;

        // 2. GST Logic
        const sellerStateCode = SELLER_DETAILS.stateCode;
        const buyerGST = invoiceData.client.gstNo || "";
        let buyerStateCode = "";
        let buyerStateName = "";

        if (buyerGST && buyerGST.length >= 2) {
            const gstDetails = getGSTDetails(buyerGST);
            if (gstDetails.stateName !== 'Unknown') {
                buyerStateCode = gstDetails.stateCode;
                buyerStateName = gstDetails.stateName;
            }
        }

        if (!buyerStateName && invoiceData.client.state) {
            buyerStateName = invoiceData.client.state;
            const stateEntry = Object.entries((await import('@/lib/utils')).GST_STATES).find(
                ([, name]) => name.toLowerCase() === buyerStateName.toLowerCase()
            );
            if (stateEntry) buyerStateCode = stateEntry[0];
        }

        invoiceData.placeOfSupply = buyerStateName ? `${buyerStateName} (${buyerStateCode})` : "N/A";

        const isIntraState = buyerStateCode === sellerStateCode;
        // Logic for tax calculation will use isIntraState...

        // Normalize items: accept both old format (price/total) and new format (rate/amount)
        invoiceData.items = (invoiceData.items || []).map(item => {
            const rawRate = item.rate || item.price || 0;
            const rate = typeof rawRate === 'string' ? parseFloat(rawRate.replace(/[^0-9.]/g, '')) || 0 : parseFloat(rawRate) || 0;
            const qty = parseInt(item.qty) || 1;

            const rawAmount = item.amount || item.total || 0;
            const amount = typeof rawAmount === 'string' ? parseFloat(rawAmount.replace(/[^0-9.]/g, '')) || (qty * rate) : parseFloat(rawAmount) || (qty * rate);
            return {
                description: item.description || 'Service',
                hsnCode: item.hsnCode || '998311',
                qty,
                rate,
                amount
            };
        });

        // Calculate Subtotal
        const subTotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
        invoiceData.subTotal = subTotal;

        const taxRate = 18; // 18% standard for IT
        let cgst = 0, sgst = 0, igst = 0, utgst = 0;

        if (isIntraState) {
            // Intra-state: CGST + SGST (9% each)
            cgst = (subTotal * (taxRate / 2)) / 100;
            sgst = (subTotal * (taxRate / 2)) / 100;
        } else {
            // Inter-state: IGST (18%)
            igst = (subTotal * taxRate) / 100;
        }

        invoiceData.taxBreakdown = {
            cgst: Math.round(cgst * 100) / 100,
            sgst: Math.round(sgst * 100) / 100,
            igst: Math.round(igst * 100) / 100,
            utgst: 0,
            taxRate
        };

        invoiceData.amount = Math.round((subTotal + cgst + sgst + igst) * 100) / 100;
        invoiceData.totalInWords = numberToWordsIndian(Math.round(invoiceData.amount));

        const newInvoice = await Invoice.create(invoiceData);

        // Notify Client if id is present
        if (newInvoice.client?.id) {
            const { createNotification } = await import('@/lib/actions/notification');
            await createNotification({
                recipientId: newInvoice.client.id,
                title: 'New Invoice Generated',
                message: `A new invoice ${newInvoice.invoiceNumber} for ₹${newInvoice.amount} has been generated.`,
                type: 'invoice',
                link: '#Billing'
            });
        }

        return { success: true, invoice: JSON.parse(JSON.stringify(newInvoice)) };
    } catch (error) {
        console.error('Error creating invoice:', error);
        return { success: false, error: 'Failed to create invoice' };
    }
}

export async function getSalesAnalytics({ startDate, endDate, groupBy = 'month' } = {}) {
    await connectDB();
    try {
        const invoices = await Invoice.find({}).lean();
        const users = await (await import('@/models/User')).default.find({ role: 'client' }).lean();
        const pricingPlans = await (await import('@/models/PricingPlan')).default.find({}).lean();
        const catalogServices = await (await import('@/models/CatalogService')).default.find({}).lean();

        const planNames = pricingPlans.map(p => p.name.toLowerCase());
        const serviceNames = catalogServices.map(s => s.name.toLowerCase());

        let totalRevenue = 0;
        const trendMap = {};
        const clientRevenueMap = {};
        const revenueByPlanMap = {};

        // Initialize plans in revenue map to ensure they show up
        pricingPlans.forEach(p => {
            revenueByPlanMap[p.name] = { name: p.name, revenue: 0, count: 0 };
        });
        revenueByPlanMap["Add-on Services"] = { name: "Add-on Services", revenue: 0, count: 0 };
        revenueByPlanMap["Within 2 Hours"] = { name: "Within 2 Hours", revenue: 0, count: 0 };
        revenueByPlanMap["Other"] = { name: "Other", revenue: 0, count: 0 };

        const categoryClients = {}; // To track unique clients per category

        // Helper to parse date correctly
        const parseDate = (date) => {
            if (!date) return null;
            const d = new Date(date);
            return isNaN(d.getTime()) ? null : d;
        };

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const availableYearsSet = new Set();

        for (const inv of invoices) {
            if (inv.status !== 'Paid') continue;

            const invDate = parseDate(inv.date) || parseDate(inv.createdAt);
            if (!invDate) continue;

            availableYearsSet.add(invDate.getFullYear());

            // Filter by Date Range
            if (start && invDate < start) continue;
            if (end && invDate > end) continue;

            // Safer amount parsing
            const totalInvAmount = typeof inv.amount === 'number' ? inv.amount :
                parseFloat(String(inv.amount || 0).replace(/[^0-9.]/g, '')) || 0;
            totalRevenue += totalInvAmount;

            // Grouping for Trend
            let groupKey;
            let sortKey;

            if (groupBy === 'year') {
                groupKey = invDate.getFullYear().toString();
                sortKey = new Date(invDate.getFullYear(), 0, 1).getTime();
            } else if (groupBy === 'quarter') {
                const q = Math.floor(invDate.getMonth() / 3) + 1;
                groupKey = `Q${q} ${invDate.getFullYear()}`;
                sortKey = new Date(invDate.getFullYear(), (q - 1) * 3, 1).getTime();
            } else if (groupBy === 'week') {
                // Get start of week
                const d = new Date(invDate);
                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
                const startOfWeek = new Date(d.setDate(diff));
                groupKey = `Week ${startOfWeek.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`;
                sortKey = startOfWeek.getTime();
            } else if (groupBy === 'day') {
                groupKey = invDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                sortKey = new Date(invDate.getFullYear(), invDate.getMonth(), invDate.getDate()).getTime();
            } else { // default month
                groupKey = invDate.toLocaleString('default', { month: 'short', year: 'numeric' });
                sortKey = new Date(invDate.getFullYear(), invDate.getMonth(), 1).getTime();
            }

            if (!trendMap[groupKey]) {
                trendMap[groupKey] = { revenue: 0, sortKey, label: groupKey };
            }
            trendMap[groupKey].revenue += totalInvAmount;

            const cid = inv.client?.id?.toString();
            const items = inv.items || [];

            // Determine Primary Category for this invoice
            let primaryCategory = "Other";
            let matchedByItem = false;

            if (items.length > 0) {
                // Try to find a plan in the items first
                for (const item of items) {
                    const itemName = (item.description || "").toLowerCase().trim();

                    // Match Plan
                    const matchedPlan = pricingPlans.find(p => {
                        const pName = p.name.toLowerCase().trim();
                        return itemName === pName ||
                            itemName.includes(pName + " plan") ||
                            itemName === pName + " subscription" ||
                            (itemName.includes(pName) && itemName.length < pName.length + 12); // "premium plan" etc
                    });

                    if (matchedPlan) {
                        primaryCategory = matchedPlan.name;
                        matchedByItem = true;
                        break; // Found a plan, this is the primary category
                    }
                }

                // If no plan, check for "Within 2 Hours"
                if (!matchedByItem) {
                    for (const item of items) {
                        const itemName = (item.description || "").toLowerCase().trim();
                        if (itemName.includes("within 2 hours") || itemName.includes("within two hours")) {
                            primaryCategory = "Within 2 Hours";
                            matchedByItem = true;
                            break;
                        }
                    }
                }

                // If still no category, check for "Add-on Services"
                if (!matchedByItem) {
                    for (const item of items) {
                        const itemName = (item.description || "").toLowerCase().trim();
                        if (serviceNames.some(sn => itemName.includes(sn)) ||
                            itemName.includes("amazon") ||
                            itemName.includes("services") ||
                            itemName.includes("subscription")) {
                            primaryCategory = "Add-on Services";
                            matchedByItem = true;
                            break;
                        }
                    }
                }
            }

            // Fallback to client's plan if nothing matched via items or no items exist
            if (!matchedByItem) {
                const user = users.find(u => u._id.toString() === cid);
                if (user?.plan) {
                    primaryCategory = user.plan;
                }
            }

            // Add the FULL invoice amount (with tax) to the primary category
            // This ensures breakdown sum = total revenue
            if (!revenueByPlanMap[primaryCategory]) {
                revenueByPlanMap[primaryCategory] = { name: primaryCategory, revenue: 0, count: 0 };
            }
            revenueByPlanMap[primaryCategory].revenue += totalInvAmount;

            if (cid) {
                if (!categoryClients[primaryCategory]) categoryClients[primaryCategory] = new Set();
                categoryClients[primaryCategory].add(cid);
            }

            // Client Revenue Summary
            if (cid) {
                if (!clientRevenueMap[cid]) {
                    const user = users.find(u => u._id.toString() === cid);
                    clientRevenueMap[cid] = {
                        _id: cid,
                        name: inv.client.name,
                        company: inv.client.company,
                        revenue: 0,
                        plan: user?.plan || "N/A"
                    };
                }
                clientRevenueMap[cid].revenue += totalInvAmount;
            }
        }

        // Finalize counts
        Object.keys(revenueByPlanMap).forEach(cat => {
            if (categoryClients[cat]) {
                revenueByPlanMap[cat].count = categoryClients[cat].size;
            } else {
                // For plans, if 0 revenue in period, we might still want to show total active clients?
                // Actually, for "Revenue by Plan" in a specific period, it should probably be clients who PAID.
                // But for "All Time", it's clients who ever paid.
                // Let's stick to clients who paid in the period for consistency with Revenue.
                revenueByPlanMap[cat].count = 0;
            }
        });

        // Special case: If we want to show ALL active clients for base plans regardless of payment in period:
        users.forEach(u => {
            const plan = u.plan || "N/A";
            if (revenueByPlanMap[plan] && revenueByPlanMap[plan].count === 0) {
                // Only if no one paid but we have active users?
                // Actually, better to just leave it as "Paid clients" to be authentic to Revenue.
            }
        });

        // Calculate Churn Rate (Disabled / Total Clients)
        const totalClientsCount = users.length;
        const disabledClientsCount = users.filter(u => u.status === 'disabled').length;
        const churnRate = totalClientsCount > 0 ? (disabledClientsCount / totalClientsCount) * 100 : 0;

        // Transform maps to arrays
        const trend = Object.values(trendMap).sort((a, b) => a.sortKey - b.sortKey);
        const topClients = Object.values(clientRevenueMap).sort((a, b) => b.revenue - a.revenue);
        const revenueByPlan = Object.values(revenueByPlanMap)
            .filter(p => p.count > 0 || p.revenue > 0)
            .sort((a, b) => b.revenue - a.revenue);

        const availableYears = Array.from(availableYearsSet).sort((a, b) => b - a);
        if (availableYears.length === 0) availableYears.push(new Date().getFullYear());

        return {
            totalRevenue,
            trend: JSON.parse(JSON.stringify(trend)),
            topClients: JSON.parse(JSON.stringify(topClients)),
            revenueByPlan: JSON.parse(JSON.stringify(revenueByPlan)),
            churnRate,
            availableYears
        };

    } catch (error) {
        console.error("Error getting sales analytics:", error);
        return { totalRevenue: 0, trend: [], topClients: [], revenueByPlan: [], churnRate: 0, availableYears: [new Date().getFullYear()] };
    }
}
