'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import Note from '@/models/Note';
import { createNotification } from '@/lib/actions/notification';
import { sendEmail, emailTemplates, verifySMTP } from '@/lib/mail';
import { logActivity } from '@/lib/actions/dashboard';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export { verifySMTP };

export async function sendClientEmail({ to, subject, body, fromAdmin, includeDashboardButton }) {
    console.log('>>> Server Action: sendClientEmail triggered');
    await connectDB();
    try {
        const template = emailTemplates.clientMessage({
            subject,
            body,
            adminName: fromAdmin.name,
            includeDashboardButton
        });

        const result = await sendEmail({
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
            replyTo: fromAdmin.email, // Ensure client replies go to the logged-in admin
            fromName: fromAdmin.name // Make it appear as from the admin
        });

        // Also notify client in-app only if mail sent successfully
        if (result.success) {
            const client = await User.findOne({ email: to });
            if (client) {
                await createNotification({
                    recipientId: client._id,
                    title: 'New Email Received',
                    message: `You received an email from ${fromAdmin.name}: "${subject}"`,
                    type: 'info',
                    link: '#Dashboard',
                    skipEmail: true
                });
            }
        }

        return result;
    } catch (error) {
        console.error('Error in sendClientEmail action:', error);
        return { success: false, error: error.message };
    }
}


// Helper: notify all super-admins about an event
export async function notifySuperAdmins({ title, message, type = 'info', link = '#Dashboard', icon, skipEmail = false }) {
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

export async function getNotes(clientId) {
    await connectDB();
    try {
        const notes = await Note.find({ clientId }).sort({ date: -1 }).lean();
        return JSON.parse(JSON.stringify(notes));
    } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }
}

export async function upsertNote(noteData) {
    await connectDB();
    try {
        const note = await Note.create(noteData);

        // Notify Client about new note
        if (note && note.clientId) {
            await createNotification({
                recipientId: note.clientId,
                title: 'New Note Added',
                message: 'A new note has been added to your file.',
                type: 'info',
                link: '#Files'
            });
        }

        await logActivity({
            action: 'New Note Added',
            target: note.title || 'Client Note',
            details: `Note added for client ID: ${note.clientId}`,
            type: 'note'
        });

        return JSON.parse(JSON.stringify(note));
    } catch (error) {
        console.error('Error creating note:', error);
        return null;
    }
}


export async function getClients(filter = {}) {
    await connectDB();
    try {
        if (filter.managerId) {
            const adminUser = await User.findById(filter.managerId).select('name');
            if (adminUser) {
                filter.$or = [
                    { managerId: filter.managerId },
                    { salesManager: adminUser.name },
                    { listingManager: adminUser.name }
                ];
                delete filter.managerId;
            }
        }
        const query = { role: 'client', ...filter };
        const clients = await User.find(query).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(clients));
    } catch (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
}

export async function upsertClient(clientData) {
    await connectDB();
    try {
        const id = clientData._id || clientData.id;
        let client;

        // Remove _id from data to avoid immutable field error on update if it exists
        const { _id, ...updateData } = clientData;

        // If manager name is provided but managerId is missing, try to find the manager by name
        if (updateData.manager && updateData.manager !== 'Unassigned' && (!updateData.managerId || updateData.manager !== clientData.manager /* check if manager name changed? clientData refers to incoming data, maybe check existing if update */)) {
            // To be safe, if manager name is present, always try to fetch/refresh managerId
            const managerUser = await User.findOne({ name: updateData.manager, role: 'admin' }).select('_id name');
            if (managerUser) {
                updateData.managerId = managerUser._id;
            } else {
                updateData.managerId = null; // Manager name might be custom or not found? Keep it or clear it? 
                // If not found, better to keep managerId null to avoid inconsistency
            }
        } else if (updateData.manager === 'Unassigned') {
            updateData.managerId = null;
        }

        if (id && id.toString().length >= 12) {
            // Find old client to check for changes
            const oldClient = await User.findById(id).lean();

            if (updateData.password) {
                updateData.plainPassword = updateData.password; // Store plain version
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }

            client = await User.findByIdAndUpdate(id, updateData, { new: true }).lean();

            // Sync task details if client info or manager changed
            if (client && oldClient) {
                const nameChanged = oldClient.name !== client.name;
                const companyChanged = oldClient.company !== client.company;
                const managerChanged = oldClient.managerId?.toString() !== client.managerId?.toString();

                if (nameChanged || companyChanged) {
                    await Task.updateMany(
                        { 'client.id': id },
                        {
                            $set: {
                                'client.name': client.name,
                                'client.company': client.company
                            }
                        }
                    );
                }

                if (managerChanged) {
                    await Task.updateMany(
                        { 'client.id': id },
                        {
                            $set: {
                                'assignee.id': client.managerId,
                                'assignee.name': client.manager,
                                'owner': client.manager
                            }
                        }
                    );
                }
            }

            // Notify managers if newly assigned or changed
            if (client && (!oldClient || oldClient.managerId?.toString() !== client.managerId?.toString() || oldClient.salesManager !== client.salesManager || oldClient.listingManager !== client.listingManager)) {
                const managerNames = [client.salesManager, client.listingManager].filter(Boolean);
                const explicitManagers = await User.find({ name: { $in: managerNames }, role: 'admin' }).select('_id');
                const managersToNotify = [];
                if (client.managerId) managersToNotify.push(client.managerId);
                explicitManagers.forEach(m => managersToNotify.push(m._id));
                const uniqueIds = [...new Set(managersToNotify.map(id => id.toString()))];
                for (const mId of uniqueIds) {
                    await createNotification({
                        recipientId: mId,
                        title: 'New Client Assigned',
                        message: `You have been assigned as a manager for ${client.name} (${client.company || 'N/A'}).`,
                        type: 'info',
                        link: '#Clients'
                    });
                }
            }
        } else {
            // Ensure email uniqueness
            const existing = await User.findOne({ email: updateData.email || clientData.email });
            if (existing) {
                throw new Error("A user with this email already exists");
            }

            // If manager name is provided, try to find the manager by name for new client
            if (updateData.manager && updateData.manager !== 'Unassigned') {
                const managerUser = await User.findOne({ name: updateData.manager, role: 'admin' }).select('_id name');
                if (managerUser) {
                    updateData.managerId = managerUser._id;
                }
            }

            if (updateData.password || clientData.password) {
                const pass = updateData.password || clientData.password;
                updateData.plainPassword = pass; // Store plain version
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(pass, salt);
            }

            client = await User.create({ ...updateData, role: 'client' });

            if (client) {
                // Determine recipients for this event - Matrix: Super Admin (Yes/Yes), Admin (Yes/Yes), Client (Yes/Yes)

                // 1. Notify Client (Self)
                await sendEmail({
                    to: client.email,
                    ...emailTemplates.welcomeAccount({
                        name: client.name,
                        email: client.email,
                        password: clientData.password || "Set during signup",
                        role: 'Client',
                        company: client.company || 'Personal',
                        dashboardUrl: `${process.env.NEXTAUTH_URL || 'https://sarvtra-labs.vercel.app'}/login`
                    })
                });
                await createNotification({
                    recipientId: client._id,
                    title: 'Welcome to Dashboard',
                    message: `Welcome ${client.name}! Your account has been created.`,
                    type: 'info',
                    link: '#Dashboard'
                });

                // 2. Notify Super-Admins
                await notifySuperAdmins({
                    title: 'New Client Registered',
                    message: `${client.name} (${client.company || 'N/A'}) has joined.`,
                    type: 'success',
                    link: '#Clients',
                    icon: 'UserPlus',
                    skipEmail: true
                });
                // Send email to Super Admins
                const superAdmins = await User.find({ role: 'super-admin' }).select('email name');
                for (const sa of superAdmins) {
                    await sendEmail({
                        to: sa.email,
                        ...emailTemplates.notification({
                            title: 'New Client Registered',
                            message: `A new client ${client.name} from ${client.company || 'N/A'} has been registered in the system.`,
                            link: `${process.env.NEXTAUTH_URL || 'https://sarvtra-labs.vercel.app'}/super-admin/dashboard?tab=Clients`
                        })
                    });
                }

                // 3. Notify assigned Managers (Admin, Sales, Listing)
                const managerNames = [client.salesManager, client.listingManager].filter(Boolean);
                const explicitManagers = await User.find({ name: { $in: managerNames }, role: 'admin' }).select('email name _id');
                const managersToNotify = [];
                if (client.managerId) {
                    const manager = await User.findById(client.managerId).select('email name _id');
                    if (manager) managersToNotify.push(manager);
                }
                explicitManagers.forEach(m => {
                    if (!managersToNotify.some(existing => existing._id.toString() === m._id.toString())) {
                        managersToNotify.push(m);
                    }
                });

                for (const manager of managersToNotify) {
                    await createNotification({
                        recipientId: manager._id,
                        title: 'New Client Assigned',
                        message: `You have been assigned as a manager for ${client.name} (${client.company || 'N/A'}).`,
                        type: 'info',
                        link: '#Clients',
                        skipEmail: true
                    });
                    if (manager.email) {
                        await sendEmail({
                            to: manager.email,
                            ...emailTemplates.notification({
                                title: 'New Client Assigned',
                                message: `You have been assigned as a manager for ${client.name} from ${client.company || 'N/A'}.`,
                                link: `${process.env.NEXTAUTH_URL || 'https://sarvtra-labs.vercel.app'}/admin/dashboard?tab=Clients`
                            })
                        });
                    }
                }
            }
        }

        await logActivity({
            action: id ? 'Client Updated' : 'New Client Added',
            target: client.company || client.name,
            details: id ? `Updated details for ${client.name}` : `Onboarded new client: ${client.name}`,
            type: 'client',
            user: { name: 'System/Admin' } // Ideally pass currentUser but this is a start
        });

        return JSON.parse(JSON.stringify(client));
    } catch (error) {
        console.error('Error upserting client:', error);
        return null; // Or throw error to be handled by UI
    }
}

export async function deleteClient(id) {
    await connectDB();
    try {
        const client = await User.findById(id).lean();
        if (client) {
            await logActivity({
                action: 'Client Removed',
                target: client.company || client.name,
                details: `Client ${client.name} has been deleted from the system`,
                type: 'client'
            });

            await notifySuperAdmins({
                title: 'Client Removed',
                message: `${client.name} (${client.company || 'N/A'}) has been removed.`,
                type: 'warning',
                link: '#Clients'
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting client:', error);
        return { success: false, error: error.message };
    }
}

export async function toggleClientStatus(id, status) {
    await connectDB();
    try {
        const client = await User.findByIdAndUpdate(id, { status }, { new: true }).lean();
        return JSON.parse(JSON.stringify(client));
    } catch (error) {
        console.error('Error toggling client status:', error);
        return null;
    }
}

export async function updateSubscribedServiceStatus(clientId, serviceId, status) {
    await connectDB();
    try {
        const client = await User.findOneAndUpdate(
            { _id: clientId, "subscribedServices._id": serviceId },
            { $set: { "subscribedServices.$.status": status } },
            { new: true }
        ).lean();

        if (client) {
            await createNotification({
                recipientId: clientId,
                title: 'Service Status Updated',
                message: `The status of your service has been updated to "${status}".`,
                type: 'info',
                link: '#Dashboard'
            });
        }

        return JSON.parse(JSON.stringify(client));
    } catch (error) {
        console.error('Error updating service status:', error);
        return null;
    }
}

export async function getTasks(filter = {}) {
    await connectDB();
    try {
        const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(tasks));
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

export async function upsertTask(taskData) {
    await connectDB();

    try {
        const id = taskData._id || taskData.id;
        let task;
        const isNew = !(id && id.toString().length >= 12);

        const { _id, ...updateData } = taskData;

        if (!isNew) {
            task = await Task.findByIdAndUpdate(id, updateData, { new: true }).lean();
        } else {
            // Generate taskId if creating new
            if (!updateData.taskId) {
                const lastTask = await Task.findOne().sort({ taskId: -1 }).select('taskId').lean();
                let nextId = 1;
                if (lastTask && lastTask.taskId) {
                    const lastIdMatch = lastTask.taskId.match(/TSK-(\d+)/);
                    if (lastIdMatch) {
                        nextId = parseInt(lastIdMatch[1]) + 1;
                    }
                }
                updateData.taskId = `TSK-${String(nextId).padStart(3, '0')}`;
            }
            task = await Task.create(updateData);
        }

        if (task) {
            console.log(`Task ${isNew ? 'created' : 'updated'} successfully:`, task.taskId);
            const isNewAssignment = isNew;
            const eventTitle = isNewAssignment ? 'A new task has been created' : 'A task update has been recorded';
            const notifTitle = isNewAssignment ? 'New Task Assigned' : 'Task Updated';
            const notifMessage = isNewAssignment ? `You have a new task: "${task.title}"` : `Task "${task.title}" has been updated.`;

            // Fetch extra data for the unified template
            let fullClient = null;
            if (task.client?.id) {
                fullClient = await User.findById(task.client.id).populate('managerId', 'name email phone').lean();
                if (fullClient?.managerId) {
                    fullClient.managerDetails = fullClient.managerId;
                }
            }
            const session = await getServerSession(authOptions);
            const initiator = session?.user;

            // Collect all unique recipients to avoid duplicate emails
            const emailRecipients = new Set();
            const pushRecipients = new Set();

            // 1. Prepare Client Notification
            if (task.client?.id) {
                await createNotification({
                    recipientId: task.client.id,
                    title: notifTitle,
                    message: notifMessage,
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
                    title: notifTitle,
                    message: notifMessage,
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
            const saMessage = isNew
                ? `New task "${task.title}" assigned to ${task.assignee?.name || 'Unassigned'} for ${task.client?.name || 'Unknown Client'}.`
                : `Task "${task.title}" has been updated.`;

            await notifySuperAdmins({
                title: notifTitle,
                message: saMessage,
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
            for (const email of emailRecipients) {
                await sendEmail({
                    to: email,
                    ...emailTemplates.taskEventNotification({
                        eventTitle,
                        task,
                        client: fullClient,
                        initiator
                    })
                });
            }
        }

        await logActivity({
            action: isNew ? 'Task Created' : 'Task Updated',
            target: task.title,
            details: isNew ? `New task assigned to ${task.assignee?.name || 'Unassigned'}` : `Status/Details changed for task ${task.taskId}`,
            type: 'task'
        });

        return JSON.parse(JSON.stringify(task));
    } catch (error) {
        console.error('Error upserting task:', error);
        return null;
    }
}

export async function deleteTask(id) {
    await connectDB();
    try {
        const task = await Task.findById(id).lean();
        if (task) {
            await Task.findByIdAndDelete(id);

            // Notify Assignee
            if (task.assignee?.id) {
                await createNotification({
                    recipientId: task.assignee.id,
                    title: 'Task Removed',
                    message: `Task "${task.title}" has been removed.`,
                    type: 'task',
                    link: '#Tasks'
                });
            }

            // Notify super-admins
            await notifySuperAdmins({
                title: 'Task Deleted',
                message: `Task "${task.title}" has been deleted.`,
                type: 'warning',
                link: '#Tasks',
                icon: 'Trash2'
            });

            await logActivity({
                action: 'Task Deleted',
                target: task.title,
                details: `Task ${task.taskId} was removed by an administrator`,
                type: 'task'
            });
        }
        return { success: true };
    } catch (error) {
        console.error('Error deleting task:', error);
        return { success: false };
    }
}

export async function uploadTaskAttachment(formData) {
    try {
        const file = formData.get('file');
        if (!file) {
            throw new Error("File missing");
        }

        const { put } = await import('@vercel/blob');
        const token = process.env.BLOB_READ_WRITE_TOKEN || "vercel_blob_rw_SZFDjh9KdeU1EfbI_Z3lvVic5ELojJ2b8yE3xnnemAQl6Oe";

        const blob = await put(file.name, file, {
            access: 'public',
            token: token,
        });

        return { success: true, url: blob.url, name: file.name };
    } catch (error) {
        console.error('Error uploading task attachment:', error);
        return { success: false, error: error.message };
    }
}

export async function getAdmins() {
    await connectDB();
    try {
        const admins = await User.find({ role: 'admin' }).sort({ createdAt: -1 }).lean();

        // Fetch client counts for each admin
        const adminsWithCounts = await Promise.all(admins.map(async (admin) => {
            const count = await User.countDocuments({
                role: 'client',
                $or: [
                    { managerId: admin._id },
                    { salesManager: admin.name },
                    { listingManager: admin.name }
                ]
            });
            return {
                ...admin,
                clientsCount: count
            };
        }));

        return JSON.parse(JSON.stringify(adminsWithCounts));
    } catch (error) {
        console.error('Error fetching admins:', error);
        return [];
    }
}

export async function getTeamMembers() {
    await connectDB();
    try {
        const team = await User.find({ role: { $in: ['admin', 'super-admin'] } })
            .select('name email role _id')
            .sort({ name: 1 })
            .lean();
        return JSON.parse(JSON.stringify(team));
    } catch (error) {
        console.error('Error fetching team members:', error);
        return [];
    }
}

export async function getFiles(filter = {}) {
    await connectDB();
    try {
        const FileModel = (await import('@/models/File')).default;
        const files = await FileModel.find(filter).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(files));
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
}

/**
 * Uploads a file and shares it with multiple clients
 * @param {FormData} formData - Contains the file and client info
 */
export async function uploadFiles(formData) {
    await connectDB();
    try {
        const file = formData.get('file');
        const selectedClients = JSON.parse(formData.get('clients') || '[]'); // Array of {id, name}
        const uploadedBy = formData.get('uploadedBy') || 'Admin';

        if (!file || selectedClients.length === 0) {
            throw new Error("File or clients missing");
        }

        // 1. Upload to Vercel Blob
        const { put } = await import('@vercel/blob');
        const token = process.env.BLOB_READ_WRITE_TOKEN || "vercel_blob_rw_SZFDjh9KdeU1EfbI_Z3lvVic5ELojJ2b8yE3xnnemAQl6Oe";

        const blob = await put(file.name, file, {
            access: 'public',
            token: token,
        });

        // 2. Create File records for each client
        const FileModel = (await import('@/models/File')).default;
        const fileType = file.name.split('.').pop().toLowerCase();
        let categorizedType = 'file';
        if (['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(fileType)) categorizedType = 'image';
        else if (['pdf'].includes(fileType)) categorizedType = 'pdf';
        else if (['xls', 'xlsx', 'csv'].includes(fileType)) categorizedType = 'excel';

        let fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        if (parseFloat(fileSize) < 0.1) {
            const kbSize = (file.size / 1024).toFixed(2) + ' KB';
            fileSize = kbSize;
        }

        const createdFiles = [];

        for (const client of selectedClients) {
            const newFile = await FileModel.create({
                name: file.name,
                clientId: client.id,
                clientName: client.name,
                type: categorizedType,
                size: (file.size / 1024 / 1024).toFixed(2) >= 0.1
                    ? (file.size / 1024 / 1024).toFixed(2) + ' MB'
                    : (file.size / 1024).toFixed(2) + ' KB',
                version: '1.0',
                uploadedBy: uploadedBy,
                url: blob.url,
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            });

            // 3. Notify Recipients - Matrix: Super Admin (Yes/Yes), Admin (Yes/Yes), Client (Yes/Yes)

            // 3.1 Notify Client
            await createNotification({
                recipientId: client.id,
                title: 'New File Received',
                message: `Admin has uploaded a new file: "${file.name}"`,
                type: 'info',
                link: '#Files',
                skipEmail: true
            });
            // Send email to client
            const clientUser = await User.findById(client.id).select('email');
            if (clientUser?.email) {
                await sendEmail({
                    to: clientUser.email,
                    ...emailTemplates.notification({
                        title: 'New File Received',
                        message: `A new file "${file.name}" has been uploaded to your account and is available for download.`,
                        link: `${process.env.NEXT_PUBLIC_APP_URL || ''}/client/dashboard#Files`
                    })
                });
            }

            // 3.2 Notify Managers (Admin)
            const fullClientDoc = await User.findById(client.id).select('managerId salesManager listingManager');
            if (fullClientDoc) {
                const managerNames = [fullClientDoc.salesManager, fullClientDoc.listingManager].filter(Boolean);
                const explicitManagers = await User.find({ name: { $in: managerNames }, role: 'admin' }).select('_id email');
                const managersToNotify = [];
                if (fullClientDoc.managerId) {
                    const manager = await User.findById(fullClientDoc.managerId).select('_id email');
                    if (manager) managersToNotify.push(manager);
                }
                explicitManagers.forEach(m => {
                    if (!managersToNotify.some(existing => existing._id.toString() === m._id.toString())) {
                        managersToNotify.push(m);
                    }
                });

                for (const manager of managersToNotify) {
                    await createNotification({
                        recipientId: manager._id,
                        title: 'File Uploaded to Client',
                        message: `A new file "${file.name}" was uploaded to ${client.name}'s account.`,
                        type: 'info',
                        link: '#Clients',
                        skipEmail: true
                    });
                    if (manager.email) {
                        await sendEmail({
                            to: manager.email,
                            ...emailTemplates.notification({
                                title: 'File Uploaded to Client',
                                message: `A new file "${file.name}" was uploaded by an administrator to ${client.name}'s account.`,
                                link: `${process.env.NEXT_PUBLIC_APP_URL || ''}/admin/dashboard?tab=Clients`
                            })
                        });
                    }
                }
            }


            // 3.3 Notify Super Admins
            await notifySuperAdmins({
                title: 'New File Uploaded',
                message: `A file "${file.name}" was uploaded by ${uploadedBy} and shared with ${client.name}.`,
                type: 'file',
                link: '#Files',
                skipEmail: true
            });
            const superAdmins = await User.find({ role: 'super-admin' }).select('email');
            for (const sa of superAdmins) {
                await sendEmail({
                    to: sa.email,
                    ...emailTemplates.notification({
                        title: 'New File Uploaded',
                        message: `A file "${file.name}" was uploaded by ${uploadedBy} and shared with ${client.name}.`,
                        link: `${process.env.NEXT_PUBLIC_APP_URL || ''}/super-admin/dashboard?tab=Files`
                    })
                });
            }

            createdFiles.push(newFile);
        }

        await logActivity({
            action: 'Files Uploaded',
            target: file.name,
            details: `Shared with ${selectedClients.length} clients`,
            type: 'file'
        });

        return { success: true, files: JSON.parse(JSON.stringify(createdFiles)) };
    } catch (error) {
        console.error('Error uploading files:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteFile(id) {
    await connectDB();
    try {
        const FileModel = (await import('@/models/File')).default;
        await FileModel.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting file:', error);
        return { success: false, error: error.message };
    }
}

export async function upsertAdmin(adminData) {
    await connectDB();
    try {
        const id = adminData._id || adminData.id;
        let admin;

        const { _id, ...updateData } = adminData;

        if (id && id.toString().length >= 12) {
            const oldAdmin = await User.findById(id).lean();

            if (updateData.password) {
                updateData.plainPassword = updateData.password; // Store plain version
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }
            admin = await User.findByIdAndUpdate(id, updateData, { new: true }).lean();

            // If name changed, update all tasks assigned to this admin
            if (admin && oldAdmin && oldAdmin.name !== admin.name) {
                await Task.updateMany(
                    { 'assignee.id': id },
                    {
                        $set: {
                            'assignee.name': admin.name,
                            'owner': admin.name
                        }
                    }
                );
            }

            // If password was updated, notify them?
            if (updateData.password) {
                await sendEmail({
                    to: admin.email,
                    ...emailTemplates.notification({
                        title: 'Account Password Updated',
                        message: `Hello ${admin.name}, your account password has been updated by the super admin. If you did not request this, please contact support.`,
                        link: `${process.env.NEXTAUTH_URL || 'https://sarvtra-labs.vercel.app'}/login`
                    })
                });
            }
        } else {
            const existing = await User.findOne({ email: adminData.email });
            if (existing) {
                throw new Error("A user with this email already exists");
            }
            if (adminData.password) {
                adminData.plainPassword = adminData.password; // Store plain version
                const salt = await bcrypt.genSalt(10);
                adminData.password = await bcrypt.hash(adminData.password, salt);
            }
            admin = await User.create({ ...adminData, role: 'admin' });

            if (admin) {
                // Determine recipients for this event - Matrix: Super Admin (Yes/Yes), Admin (Yes/Yes), Client (No/No)

                // 1. Notify Admin (Self) - Welcome Mail
                await sendEmail({
                    to: admin.email,
                    ...emailTemplates.welcomeAccount({
                        name: admin.name,
                        email: admin.email,
                        password: adminData.password_plain || "As set by administrator",
                        role: 'Admin / ' + (admin.adminRole || 'Account Manager'),
                        dashboardUrl: `${process.env.NEXTAUTH_URL || 'https://sarvtra-labs.vercel.app'}/login`
                    })
                });
                await createNotification({
                    recipientId: admin._id,
                    title: 'Welcome Admin',
                    message: `Welcome ${admin.name}! Your admin account is ready.`,
                    type: 'info',
                    link: '#Dashboard'
                });

                // 2. Notify super-admins
                await notifySuperAdmins({
                    title: 'New Admin Created',
                    message: `${admin.name} (${admin.email}) has been added as an admin.`,
                    type: 'success',
                    link: '#Admins',
                    icon: 'UserPlus'
                });
                // Send email to super-admins
                const superAdmins = await User.find({ role: 'super-admin' }).select('email');
                for (const sa of superAdmins) {
                    await sendEmail({
                        to: sa.email,
                        ...emailTemplates.notification({
                            title: 'New Admin Account Created',
                            message: `A new admin account for ${admin.name} (${admin.email}) has been created in the system.`,
                            link: `${process.env.NEXTAUTH_URL || 'https://sarvtra-labs.vercel.app'}/super-admin/dashboard?tab=Admins`
                        })
                    });
                }
            }
        }
        return JSON.parse(JSON.stringify(admin));
    } catch (error) {
        console.error('Error upserting admin:', error);
        throw new Error(error.message || 'Failed to preserve admin');
    }
}

export async function deleteAdmin(id) {
    await connectDB();
    try {
        const admin = await User.findById(id).lean();
        await User.findByIdAndDelete(id);

        // Notify super-admins about deleted admin
        if (admin) {
            await notifySuperAdmins({
                title: 'Admin Removed',
                message: `${admin.name} (${admin.email}) has been removed as an admin.`,
                type: 'warning',
                link: '#Admins'
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting admin:', error);
        return { success: false, error: error.message };
    }
}

export async function toggleAdminStatus(id, status) {
    await connectDB();
    try {
        const admin = await User.findByIdAndUpdate(id, { status }, { new: true }).lean();
        return JSON.parse(JSON.stringify(admin));
    } catch (error) {
        console.error('Error toggling admin status:', error);
        return null;
    }
}
