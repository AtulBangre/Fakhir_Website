'use server';

import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';

export async function getTeams() {
    await connectDB();
    try {
        const teams = await Team.find({})
            .populate('leadId', 'name email adminRole')
            .populate('memberIds', 'name email adminRole')
            .lean();

        // Calculate client counts
        const teamsWithCounts = await Promise.all(teams.map(async (team) => {
            const clientCount = await User.countDocuments({
                role: 'client',
                teams: { $in: [team._id] }
            });
            return { ...team, clientCount };
        }));

        return JSON.parse(JSON.stringify(teamsWithCounts));
    } catch (error) {
        console.error('Error fetching teams:', error);
        return [];
    }
}

export async function getTeamWithMembers(teamId) {
    await connectDB();
    try {
        const team = await Team.findById(teamId)
            .populate('leadId', 'name email adminRole')
            .populate('memberIds', 'name email adminRole performance status')
            .lean();
        return JSON.parse(JSON.stringify(team));
    } catch (error) {
        console.error('Error fetching team with members:', error);
        return null;
    }
}

export async function createTeam(teamData) {
    await connectDB();
    try {
        const newTeam = await Team.create(teamData);

        if (newTeam) {
            const { createNotification } = await import('@/lib/actions/notification');
            const { sendEmail, emailTemplates } = await import('@/lib/mail');

            // Find all admins involved (Lead + Members)
            const recipientIds = [...new Set([newTeam.leadId, ...newTeam.memberIds])];
            const recipients = await User.find({ _id: { $in: recipientIds } }).select('email name _id');

            for (const recipient of recipients) {
                // In-App Notification
                await createNotification({
                    recipientId: recipient._id,
                    title: 'New Team Created',
                    message: `You have been added to a new team: "${newTeam.name}".`,
                    type: 'info',
                    link: '#Teams'
                });

                // Email Notification
                if (recipient.email) {
                    await sendEmail({
                        to: recipient.email,
                        ...emailTemplates.notification({
                            title: 'New Team Created',
                            message: `Hello ${recipient.name}, a new team "${newTeam.name}" has been created and you are part of it.`,
                            link: `${process.env.NEXT_PUBLIC_APP_URL || ''}/admin/dashboard?tab=Teams`
                        })
                    });
                }
            }
        }

        return JSON.parse(JSON.stringify(newTeam));
    } catch (error) {
        console.error('Error creating team:', error);
        throw new Error(error.message || 'Failed to create team');
    }
}

export async function updateTeam(teamId, teamData) {
    await connectDB();
    try {
        const updatedTeam = await Team.findByIdAndUpdate(teamId, teamData, { new: true })
            .populate('leadId', 'name email adminRole')
            .populate('memberIds', 'name email adminRole')
            .lean();

        if (updatedTeam) {
            const { createNotification } = await import('@/lib/actions/notification');
            const { sendEmail, emailTemplates } = await import('@/lib/mail');

            // Find all admins involved
            const recipientIds = [...new Set([updatedTeam.leadId?._id || updatedTeam.leadId, ...(updatedTeam.memberIds.map(m => m._id || m))])];
            const recipients = await User.find({ _id: { $in: recipientIds } }).select('email name _id');

            for (const recipient of recipients) {
                await createNotification({
                    recipientId: recipient._id,
                    title: 'Team Updated',
                    message: `The team "${updatedTeam.name}" has been updated.`,
                    type: 'info',
                    link: '#Teams'
                });

                if (recipient.email) {
                    await sendEmail({
                        to: recipient.email,
                        ...emailTemplates.notification({
                            title: 'Team Updated',
                            message: `Hello ${recipient.name}, the team "${updatedTeam.name}" has been updated with new details.`,
                            link: `${process.env.NEXT_PUBLIC_APP_URL || ''}/admin/dashboard?tab=Teams`
                        })
                    });
                }
            }
        }

        return JSON.parse(JSON.stringify(updatedTeam));
    } catch (error) {
        console.error('Error updating team:', error);
        throw new Error(error.message || 'Failed to update team');
    }
}

export async function deleteTeam(teamId) {
    await connectDB();
    try {
        await Team.findByIdAndDelete(teamId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting team:', error);
        throw new Error(error.message || 'Failed to delete team');
    }
}
