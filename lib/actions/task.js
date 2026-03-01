'use server';

import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import { createNotification } from '@/lib/actions/notification';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper: notify all super-admins about an event
async function notifySuperAdmins({ title, message, type = 'info', link = '#Dashboard', icon, skipEmail = false }) {
    try {
        const superAdmins = await User.find({ role: 'super-admin' }).select('_id').lean();
        await Promise.all(
            superAdmins.map(sa =>
                createNotification({ recipientId: sa._id, title, message, type, link, icon, skipEmail })
            )
        );
    } catch (error) {
        console.error('Error notifying super-admins:', error);
    }
}

export async function getTasks({
    page = 1,
    limit = 10,
    status = '',
    priority = '',
    clientId = null,
    assigneeId = null,
    search = ''
} = {}) {
    await connectDB();
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (clientId) query['client.id'] = clientId;
    if (assigneeId) query['assignee.id'] = assigneeId;

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'client.name': { $regex: search, $options: 'i' } }
        ];
    }

    try {
        const tasks = await Task.find(query)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Task.countDocuments(query);

        return {
            tasks: JSON.parse(JSON.stringify(tasks)),
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        };
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return { tasks: [], total: 0, pages: 0, error: 'Failed to fetch tasks' };
    }
}

export async function updateTaskStatus(taskId, status) {
    await connectDB();
    try {
        const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true }).lean();

        if (task) {
            const subject = `Task Status Updated: ${task.title}`;
            const message = `Task "${task.title}" is now ${status}`;

            // Fetch full client details for email
            const fullClient = await User.findById(task.client.id).populate('managerId', 'name email phone').lean();
            if (fullClient?.managerId) {
                fullClient.managerDetails = fullClient.managerId;
            }
            const session = await getServerSession(authOptions);
            const initiator = session?.user;

            const eventTitle = status === 'Completed' ? 'A task has been completed' : 'A task status has been updated';

            // Colors
            const statusColor = status === 'Completed' ? '#81c784' : (status === 'On Hold' ? '#e5e5e5' : '#fff176');
            const priorityColor = task.priority === 'Urgent' ? '#ef9a9a' : (task.priority === 'High' ? '#64b5f6' : '#fff');

            // Collect all unique recipients to avoid duplicate emails
            const emailRecipients = new Set();

            // 1. Prepare Client Notification
            if (task.client?.id) {
                await createNotification({
                    recipientId: task.client.id,
                    title: 'Task Status Updated',
                    message,
                    type: 'task',
                    link: '#Tasks',
                    skipEmail: true // We'll send the detailed email manually
                });
                if (fullClient?.email) {
                    emailRecipients.add(fullClient.email);
                }
            }

            // 2. Prepare Assignee Notification
            if (task.assignee?.id) {
                await createNotification({
                    recipientId: task.assignee.id,
                    title: 'Task Status Updated',
                    message,
                    type: 'task',
                    link: '#Tasks',
                    skipEmail: true // We'll send the detailed email manually
                });
                const admin = await User.findById(task.assignee.id).select('email');
                if (admin?.email) {
                    emailRecipients.add(admin.email);
                }
            }

            // 3. Prepare Super-Admin Notifications
            await notifySuperAdmins({
                title: 'Task Status Updated',
                message: `${message} (${task.client?.name || 'Unknown Client'}).`,
                type: 'task',
                link: '#Tasks',
                skipEmail: true // We'll send the detailed email manually
            });

            const superAdmins = await User.find({ role: 'super-admin' }).select('email');
            for (const sa of superAdmins) {
                if (sa.email) {
                    emailRecipients.add(sa.email);
                }
            }

            // 4. Send the detailed email to all unique recipients
            const { sendEmail, emailTemplates } = await import('@/lib/mail');
            for (const email of emailRecipients) {
                await sendEmail({
                    to: email,
                    ...emailTemplates.taskEventNotification({
                        eventTitle,
                        task,
                        client: fullClient,
                        initiator,
                        statusColor
                    })
                });
            }
        }

        return JSON.parse(JSON.stringify(task));
    } catch (error) {
        console.error('Error updating task status:', error);
        return null;
    }
}

export async function addTaskUpdate(taskId, update) {
    await connectDB();
    try {
        const task = await Task.findByIdAndUpdate(taskId, {
            $push: { updates: { ...update, date: new Date() } }
        }, { new: true }).lean();

        if (task) {
            const subject = `New Task Update: ${task.title}`;
            const message = `New update on task "${task.title}"`;

            // Fetch full client details
            const fullClient = await User.findById(task.client.id).populate('managerId', 'name email phone').lean();
            if (fullClient?.managerId) {
                fullClient.managerDetails = fullClient.managerId;
            }
            const session = await getServerSession(authOptions);
            const initiator = session?.user;

            const eventTitle = 'A task update has been recorded';

            // Collect all unique recipients to avoid duplicate emails
            const emailRecipients = new Set();

            // 1. Prepare Client Notification
            if (task.client?.id) {
                await createNotification({
                    recipientId: task.client.id,
                    title: 'New Task Update',
                    message,
                    type: 'task',
                    link: '#Tasks',
                    skipEmail: true // We'll send the detailed email manually
                });
                if (fullClient?.email) {
                    emailRecipients.add(fullClient.email);
                }
            }

            // 2. Prepare Assignee Notification
            if (task.assignee?.id) {
                await createNotification({
                    recipientId: task.assignee.id,
                    title: 'New Task Update',
                    message,
                    type: 'task',
                    link: '#Tasks',
                    skipEmail: true // We'll send the detailed email manually
                });
                const admin = await User.findById(task.assignee.id).select('email');
                if (admin?.email) {
                    emailRecipients.add(admin.email);
                }
            }

            // 3. Prepare Super-Admin Notifications
            await notifySuperAdmins({
                title: 'New Task Update',
                message: `Update posted on task "${task.title}" for ${task.client?.name || 'Unknown Client'}.`,
                type: 'task',
                link: '#Tasks',
                skipEmail: true // We'll send the detailed email manually
            });

            const superAdmins = await User.find({ role: 'super-admin' }).select('email');
            for (const sa of superAdmins) {
                if (sa.email) {
                    emailRecipients.add(sa.email);
                }
            }

            // 4. Send the detailed email to all unique recipients
            const { sendEmail, emailTemplates } = await import('@/lib/mail');
            for (const email of emailRecipients) {
                await sendEmail({
                    to: email,
                    ...emailTemplates.taskEventNotification({
                        eventTitle,
                        task: { ...task, description: `Update: ${update.message}` },
                        client: fullClient,
                        initiator
                    })
                });
            }
        }

        return JSON.parse(JSON.stringify(task));
    } catch (error) {
        console.error('Error adding task update:', error);
        return null;
    }
}

/**
 * Checks for overdue tasks and notifies Super Admin, Admins, and POCs.
 * Matrix: Super Admin (Yes/Yes), Admin (Yes/Yes), Client (No/No)
 * Special Rule: Notify Assigned POC, Super Admin, Admin. Do NOT notify Client.
 */
export async function notifyOverdueTasks() {
    await connectDB();
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find tasks that are not completed and have a due date in the past or today
        // Note: dueDate is stored as a string, we'll try to parse it if it looks like a date
        const overdueTasks = await Task.find({
            status: { $ne: 'Completed' },
            dueDate: { $exists: true, $ne: '' }
        }).lean();

        const filteredOverdue = overdueTasks.filter(task => {
            const d = new Date(task.dueDate);
            return !isNaN(d.getTime()) && d < today;
        });

        if (filteredOverdue.length === 0) return { success: true, count: 0 };

        const { sendEmail, emailTemplates } = await import('@/lib/mail');

        for (const task of filteredOverdue) {
            const title = `Task Overdue: ${task.taskId}`;
            const message = `Task "${task.title}" for ${task.client?.name || 'Unknown Client'} is overdue (Due: ${task.dueDate}).`;

            // Fetch full client details
            const fullClient = await User.findById(task.client.id).populate('managerId', 'name email phone').lean();
            if (fullClient?.managerId) {
                fullClient.managerDetails = fullClient.managerId;
            }
            const initiator = { name: 'System Monitor', email: 'support@fakhriitservices.com' };
            const eventTitle = 'A task has become overdue';

            // Collect all unique recipients to avoid duplicate emails
            const emailRecipients = new Set();

            // 1. Prepare Assignee Notification (POC/Admin)
            if (task.assignee?.id) {
                await createNotification({
                    recipientId: task.assignee.id,
                    title,
                    message,
                    type: 'warning',
                    link: '#Tasks',
                    skipEmail: true
                });
                const admin = await User.findById(task.assignee.id).select('email');
                if (admin?.email) {
                    emailRecipients.add(admin.email);
                }
            }

            // 2. Prepare Super Admin Notifications
            await notifySuperAdmins({
                title,
                message,
                type: 'warning',
                link: '#Tasks',
                icon: 'AlertTriangle',
                skipEmail: true
            });
            const superAdmins = await User.find({ role: 'super-admin' }).select('email');
            for (const sa of superAdmins) {
                if (sa.email) {
                    emailRecipients.add(sa.email);
                }
            }

            // 3. Prepare additional Admins if needed (managers of the client)
            if (task.client?.id) {
                const client = await User.findById(task.client.id).select('managerId salesManager listingManager');
                const managerNames = [client?.salesManager, client?.listingManager].filter(Boolean);
                const explicitManagers = await User.find({ name: { $in: managerNames }, role: 'admin' }).select('email phone name _id');
                const managersToNotify = [];
                if (client?.managerId) {
                    const manager = await User.findById(client.managerId).select('email phone name _id');
                    if (manager) managersToNotify.push(manager);
                }
                explicitManagers.forEach(m => {
                    if (!managersToNotify.some(existing => existing._id.toString() === m._id.toString())) {
                        managersToNotify.push(m);
                    }
                });

                for (const manager of managersToNotify) {
                    if (manager._id.toString() !== task.assignee?.id?.toString()) {
                        await createNotification({
                            recipientId: manager._id,
                            title,
                            message,
                            type: 'warning',
                            link: '#Tasks',
                            skipEmail: true
                        });
                        if (manager.email) {
                            emailRecipients.add(manager.email);
                        }
                    }
                }
            }

            // 4. Send the detailed overdue email to all unique recipients
            for (const email of emailRecipients) {
                await sendEmail({
                    to: email,
                    ...emailTemplates.taskEventNotification({
                        eventTitle,
                        task,
                        client: fullClient,
                        initiator,
                        dueDateColor: '#ff5252'
                    })
                });
            }
        }

        return { success: true, count: filteredOverdue.length };
    } catch (error) {
        console.error('Error notifying overdue tasks:', error);
        return { success: false, error: error.message };
    }
}
