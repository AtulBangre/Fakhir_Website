import mongoose from 'mongoose';
import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';
import Team from '../models/Team.js';

async function seedTeams() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // 1. Get or Create Teams
        let teams = await Team.find({});
        if (teams.length === 0) {
            console.log('No teams found. Creating default teams...');
            const defaultTeams = [
                { name: 'Alpha Squad', description: 'Primary sales and support team' },
                { name: 'Beta Force', description: 'Technical implementations' },
                { name: 'Gamma Group', description: 'Customer success specialists' },
                { name: 'Delta Division', description: 'Enterprise accounts' }
            ];

            // Get some admins to be leads
            const admins = await User.find({ role: 'admin' });

            teams = await Promise.all(defaultTeams.map(async (t, i) => {
                const lead = admins[i % admins.length];
                return await Team.create({
                    ...t,
                    leadId: lead ? lead._id : null,
                    memberIds: lead ? [lead._id] : [],
                    status: 'active'
                });
            }));
            console.log(`Created ${teams.length} teams.`);
        } else {
            console.log(`Found ${teams.length} existing teams.`);
        }

        // 2. Assign Teams to Clients
        const clients = await User.find({ role: 'client' });
        console.log(`Found ${clients.length} clients.`);

        let updatedCount = 0;
        for (const client of clients) {
            // Randomly assign 1 or 2 teams
            const numTeams = Math.floor(Math.random() * 2) + 1; // 1 or 2
            const shuffled = teams.sort(() => 0.5 - Math.random());
            const selectedTeams = shuffled.slice(0, numTeams);

            const teamIds = selectedTeams.map(t => t._id);

            await User.findByIdAndUpdate(client._id, {
                teams: teamIds
            });
            updatedCount++;
        }

        console.log(`Updated ${updatedCount} clients with team assignments.`);
        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seedTeams();
