'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import ProfileUpdateRequest from '@/models/ProfileUpdateRequest';
import { createNotification } from '@/lib/actions/notification';
import { revalidatePath } from 'next/cache';

// Helper: notify all super-admins
async function notifySuperAdmins({ title, message, type = 'info', link = '#' }) {
    try {
        await connectDB();
        const superAdmins = await User.find({ role: 'super-admin' }).select('_id').lean();
        console.log(`Notifying ${superAdmins.length} super-admins`);
        await Promise.all(
            superAdmins.map(sa =>
                createNotification({
                    recipientId: sa._id,
                    title,
                    message,
                    type,
                    link
                })
            )
        );
    } catch (error) {
        console.error('Error notifying super-admins:', error);
    }
}

export async function submitProfileUpdateRequest(userId, newData) {
    console.log(`Submitting profile update request for user: ${userId}`);
    await connectDB();
    try {
        const user = await User.findById(userId).lean();
        if (!user) throw new Error("User not found");

        const oldData = {
            name: user.name || "",
            phone: user.phone || "",
            company: user.company || "",
            location: user.location || ""
        };

        // Check if there is already a pending request to prevent duplicates
        const existingPending = await ProfileUpdateRequest.findOne({
            $or: [{ user: userId }, { client: userId }],
            status: 'pending'
        });

        if (existingPending) {
            console.log("Found existing pending request:", existingPending._id);
            return { success: false, error: "You already have a pending profile update request." };
        }

        const requestData = {
            user: userId,
            client: userId, // Legacy support
            userName: user.name,
            userRole: user.role,
            oldData,
            newData,
            status: 'pending'
        };

        const request = await ProfileUpdateRequest.create(requestData);
        console.log(`Request created with ID: ${request._id}`);

        await notifySuperAdmins({
            title: 'Profile Update Request',
            message: `${user.name} (${user.role}) has requested to update their profile.`,
            type: 'warning',
            link: '/super-admin/dashboard?tab=responses&subtab=profile-updates'
        });

        revalidatePath('/super-admin/dashboard');
        return { success: true, id: request._id.toString() };
    } catch (error) {
        console.error('Error submitting profile update request:', error);
        return { success: false, error: error.message };
    }
}

export async function getProfileUpdateRequests() {
    await connectDB();
    try {
        console.log("Fetching profile update requests...");
        // Check collection count first
        const count = await ProfileUpdateRequest.countDocuments();
        console.log("Count in DB:", count);

        const requests = await ProfileUpdateRequest.find()
            .sort({ createdAt: -1 })
            .lean();

        console.log(`Found ${requests?.length || 0} raw requests in DB`);

        const normalized = requests.map(r => {
            const userObj = r.user || r.client;
            return {
                ...r,
                user: userObj,
                userName: r.userName || (userObj?.name || r.clientName || "Unknown"),
                userRole: r.userRole || (userObj?.role || "client"),
                newData: r.newData || {},
                oldData: r.oldData || {}
            };
        });

        const result = JSON.parse(JSON.stringify(normalized));
        console.log("Returning requests:", result.length);

        if (result.length === 0) {
            return [{
                _id: "mock-1",
                userName: "System Test (No DB Data)",
                userRole: "system",
                newData: { status: "This is mock data because DB was empty" },
                oldData: { status: "No data" },
                status: "pending",
                createdAt: new Date().toISOString()
            }];
        }

        return result;
    } catch (error) {
        console.error('Error fetching profile update requests:', error);
        return [];
    }
}

export async function approveProfileUpdateRequest(requestId, updatedNewData, adminNotes = "") {
    console.log(`Approving request: ${requestId}`);
    await connectDB();
    try {
        if (requestId === 'mock-1') return { success: true };

        const request = await ProfileUpdateRequest.findById(requestId);
        if (!request) throw new Error("Request not found");

        const userId = request.user || request.client;
        if (!userId) throw new Error("User ID not found in request record");

        const dataToUpdate = updatedNewData || request.newData;
        await User.findByIdAndUpdate(userId, dataToUpdate, { new: true });

        request.status = 'approved';
        request.adminNotes = adminNotes;
        if (updatedNewData) {
            request.newData = updatedNewData;
        }
        await request.save();

        await createNotification({
            recipientId: userId,
            title: 'Profile Updated',
            message: 'Your profile update request has been approved and applied.',
            type: 'success',
            link: request.userRole === 'admin' ? '/admin/dashboard?tab=Profile' : '/client/dashboard?tab=Profile'
        });

        // Force revalidation of all paths
        revalidatePath('/super-admin/dashboard');
        revalidatePath('/admin/dashboard');
        revalidatePath('/client/dashboard');
        revalidatePath('/', 'layout'); // Try global layout reval as well

        return { success: true };
    } catch (error) {
        console.error('Error approving profile update request:', error);
        return { success: false, error: error.message };
    }
}

export async function rejectProfileUpdateRequest(requestId, adminNotes = "") {
    console.log(`Rejecting request: ${requestId}`);
    await connectDB();
    try {
        if (requestId === 'mock-1') return { success: true };

        const request = await ProfileUpdateRequest.findById(requestId);
        if (!request) throw new Error("Request not found");

        const userId = request.user || request.client;

        request.status = 'rejected';
        request.adminNotes = adminNotes;
        await request.save();

        if (userId) {
            await createNotification({
                recipientId: userId,
                title: 'Profile Update Rejected',
                message: 'Your profile update request was not approved. Notes: ' + adminNotes,
                type: 'error',
                link: request.userRole === 'admin' ? '/admin/dashboard?tab=Profile' : '/client/dashboard?tab=Profile'
            });
        }

        revalidatePath('/super-admin/dashboard');
        revalidatePath('/admin/dashboard');
        revalidatePath('/client/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Error rejecting profile update request:', error);
        return { success: false, error: error.message };
    }
}

export async function getPendingRequestForUser(userId) {
    if (!userId) return null;
    await connectDB();
    try {
        const query = {
            $or: [{ user: userId }, { client: userId }],
            status: 'pending'
        };
        const request = await ProfileUpdateRequest.findOne(query).lean();
        return request ? JSON.parse(JSON.stringify(request)) : null;
    } catch (error) {
        console.error('Error getting pending request for user:', userId, error);
        return null;
    }
}
