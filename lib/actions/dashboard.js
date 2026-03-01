'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import Invoice from '@/models/Invoice';
import ActivityLog from '@/models/ActivityLog';

/**
 * Helper: get previous period range for comparison
 */
function getPreviousPeriodRange(startDate, endDate) {
    if (!startDate || !endDate) return { prevStart: null, prevEnd: null };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 1); // 1ms before current start
    const prevStart = new Date(prevEnd.getTime() - duration);
    return { prevStart, prevEnd };
}

export async function getDashboardStats({ startDate, endDate } = {}) {
    await connectDB();
    try {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        // Total counts (always current state)
        const totalClients = await User.countDocuments({ role: 'client' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const activeClients = await User.countDocuments({ role: 'client', status: 'active' });

        // Period-specific: new clients joined in this period
        let newClientsInPeriod = 0;
        let prevNewClients = 0;
        if (start && end) {
            newClientsInPeriod = await User.countDocuments({
                role: 'client',
                createdAt: { $gte: start, $lte: end }
            });
            // Previous period comparison
            const { prevStart, prevEnd } = getPreviousPeriodRange(start, end);
            if (prevStart && prevEnd) {
                prevNewClients = await User.countDocuments({
                    role: 'client',
                    createdAt: { $gte: prevStart, $lte: prevEnd }
                });
            }
        }

        // Tasks: Active tasks (current state - always useful)
        const activeTasks = await Task.countDocuments({
            status: { $in: ['To Do', 'In Progress', 'In Review'] }
        });

        // Tasks completed in the period
        let completedInPeriod = 0;
        let prevCompletedInPeriod = 0;
        let tasksCreatedInPeriod = 0;
        if (start && end) {
            completedInPeriod = await Task.countDocuments({
                status: 'Completed',
                updatedAt: { $gte: start, $lte: end }
            });
            tasksCreatedInPeriod = await Task.countDocuments({
                createdAt: { $gte: start, $lte: end }
            });
            const { prevStart, prevEnd } = getPreviousPeriodRange(start, end);
            if (prevStart && prevEnd) {
                prevCompletedInPeriod = await Task.countDocuments({
                    status: 'Completed',
                    updatedAt: { $gte: prevStart, $lte: prevEnd }
                });
            }
        } else {
            completedInPeriod = await Task.countDocuments({ status: 'Completed' });
        }

        // Revenue in period
        let invoiceQuery = { status: 'Paid' };
        let prevInvoiceQuery = { status: 'Paid' };
        if (start && end) {
            invoiceQuery.$or = [
                { date: { $gte: start, $lte: end } },
                { createdAt: { $gte: start, $lte: end } }
            ];
            const { prevStart, prevEnd } = getPreviousPeriodRange(start, end);
            if (prevStart && prevEnd) {
                prevInvoiceQuery.$or = [
                    { date: { $gte: prevStart, $lte: prevEnd } },
                    { createdAt: { $gte: prevStart, $lte: prevEnd } }
                ];
            }
        }

        const invoices = await Invoice.find(invoiceQuery).lean();
        const totalRevenue = invoices.reduce((sum, inv) => {
            const val = typeof inv.amount === 'number' ? inv.amount :
                parseFloat(String(inv.amount || 0).replace(/[^0-9.]/g, '')) || 0;
            return sum + val;
        }, 0);

        // Previous period revenue for comparison
        let prevRevenue = 0;
        if (start && end) {
            const prevInvoices = await Invoice.find(prevInvoiceQuery).lean();
            prevRevenue = prevInvoices.reduce((sum, inv) => {
                const val = typeof inv.amount === 'number' ? inv.amount :
                    parseFloat(String(inv.amount || 0).replace(/[^0-9.]/g, '')) || 0;
                return sum + val;
            }, 0);
        }

        // Pending invoices
        const pendingInvoices = await Invoice.countDocuments({ status: 'Pending' });

        // Recent activities
        const recentActivities = await ActivityLog.find({})
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        // Calculate percentage changes
        const revenueChange = prevRevenue > 0
            ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
            : (totalRevenue > 0 ? 100 : 0);

        const clientsChange = prevNewClients > 0
            ? Math.round(((newClientsInPeriod - prevNewClients) / prevNewClients) * 100)
            : (newClientsInPeriod > 0 ? 100 : 0);

        const tasksChange = prevCompletedInPeriod > 0
            ? Math.round(((completedInPeriod - prevCompletedInPeriod) / prevCompletedInPeriod) * 100)
            : (completedInPeriod > 0 ? 100 : 0);

        return {
            stats: {
                // Client metrics
                totalClients,
                activeClients,
                newClientsInPeriod,
                clientsChange,

                // Revenue metrics
                totalRevenue,
                revenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
                revenueChange,
                prevRevenue,

                // Task metrics
                activeTasks,
                completedInPeriod,
                tasksCreatedInPeriod,
                tasksChange,

                // Other
                totalAdmins,
                pendingInvoices,
            },
            recentActivities: JSON.parse(JSON.stringify(recentActivities))
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
    }
}

export async function logActivity(data) {
    await connectDB();
    try {
        const log = await ActivityLog.create(data);
        return JSON.parse(JSON.stringify(log));
    } catch (error) {
        console.error('Error logging activity:', error);
        return null;
    }
}

export async function getActivityLogs(timeframe = '24h') {
    await connectDB();
    try {
        let query = {};
        if (timeframe === '24h') {
            const yesterday = new Date();
            yesterday.setHours(yesterday.getHours() - 24);
            query.timestamp = { $gte: yesterday };
        }
        const logs = await ActivityLog.find(query)
            .sort({ timestamp: -1 })
            .lean();
        return JSON.parse(JSON.stringify(logs));
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return [];
    }
}
