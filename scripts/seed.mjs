import mongoose from 'mongoose';
import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';
import BlogPost from '../models/BlogPost.js';
import Service from '../models/Service.js';
import PricingPlan from '../models/PricingPlan.js';
import FAQ from '../models/FAQ.js';
import Testimonial from '../models/Testimonial.js';
import Task from '../models/Task.js';
import Invoice from '../models/Invoice.js';
import TeamMember from '../models/TeamMember.js';
import ActivityLog from '../models/ActivityLog.js';
import Notification from '../models/Notification.js';
import Company from '../models/Company.js';
import File from '../models/File.js';
import Job from '../models/Job.js';
import Milestone from '../models/Milestone.js';
import Note from '../models/Note.js';
import Team from '../models/Team.js';
import CatalogService from '../models/CatalogService.js';

import { admins } from '../data/admins.js';
import { clients } from '../data/clients.js';
import { allBlogPosts } from '../data/allBlogPosts.js';
import { allServices } from '../data/allServices.js';
import { plans, planFeatures } from '../data/pricingPlans.js';
import { allFAQs } from '../data/allFAQs.js';
import { allTestimonials } from '../data/allTestimonials.js';
import { allTasks } from '../data/tasks.js';
import { invoices } from '../data/invoices.js';
import { teammembers } from '../data/teammembers.js';
import { activityLogs } from '../data/activityLogs.js';
import { mockNotifications } from '../data/notifications.js';
import { companyData } from '../data/company.js';
import { files } from '../data/files.js';
import { jobPositions } from '../data/jobs.js';
import { companymilestones } from '../data/milestones.js';
import { notesData } from '../data/notes.js';
import { teams } from '../data/teams.js';
import { servicesCatalog } from '../data/servicesCatalog.js';

async function seed() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await BlogPost.deleteMany({});
        await Service.deleteMany({});
        await PricingPlan.deleteMany({});
        await FAQ.deleteMany({});
        await Testimonial.deleteMany({});
        await Task.deleteMany({});
        await Invoice.deleteMany({});
        await TeamMember.deleteMany({});
        await ActivityLog.deleteMany({});
        await Notification.deleteMany({});
        await Company.deleteMany({});
        await File.deleteMany({});
        await Job.deleteMany({});
        await Milestone.deleteMany({});
        await Note.deleteMany({});
        await Team.deleteMany({});
        await CatalogService.deleteMany({});

        console.log('Cleared existing data');

        // Seed Company Data
        await Company.create(companyData);
        console.log('Seeded company data');

        // Add a Super Admin
        const superAdmin = await User.create({
            name: 'Super Admin',
            email: 'superadmin@fakhriit.com',
            role: 'super-admin',
            permissions: ['read', 'write', 'manage_clients', 'manage_teams', 'manage_admins'],
            status: 'active'
        });

        // Seed Admins
        const managerMap = {};
        for (const admin of admins) {
            const createdAdmin = await User.create({
                name: admin.name,
                email: admin.email,
                role: 'admin',
                adminRole: admin.role,
                team: admin.team,
                teamId: admin.teamId,
                phone: admin.phone,
                status: admin.status === 'active' ? 'active' : 'disabled',
                permissions: admin.permissions,
                performance: admin.performance,
                joinedDate: admin.joinedDate ? new Date(admin.joinedDate) : new Date()
            });
            managerMap[admin.name] = createdAdmin._id;
            managerMap[admin.id] = createdAdmin._id; // Map by legacy ID too
        }
        console.log(`Seeded ${admins.length + 1} users (1 Super Admin, ${admins.length} Admins)`);

        // Seed Teams
        for (const team of teams) {
            await Team.create({
                ...team,
                id: undefined,
                leadId: managerMap[team.leadId],
                memberIds: team.memberIds.map(id => managerMap[id])
            });
        }
        console.log(`Seeded ${teams.length} teams`);

        // Seed Clients
        const clientMap = {};
        for (const client of clients) {
            const createdClient = await User.create({
                name: client.name,
                email: client.email,
                role: 'client',
                company: client.company,
                phone: client.phone,
                plan: client.plan,
                status: client.status,
                manager: client.manager,
                managerId: managerMap[client.manager] || null,
                salesManager: client.salesManager,
                spCentralRequestId: client.spCentralRequestId,
                marketplace: client.marketplace,
                userPermission: client.userPermission,
                accountAccessUrl: client.accountAccessUrl,
                leadSource: client.leadSource,
                listingManager: client.listingManager,
                location: client.location,
                joinedDate: client.joinedDate ? new Date(client.joinedDate) : new Date()
            });
            clientMap[client.id] = createdClient._id;
            clientMap[client.name] = createdClient._id;
        }
        console.log(`Seeded ${clients.length} clients`);

        // Seed Files
        await File.insertMany(files.map(f => ({
            ...f,
            id: undefined,
            clientId: clientMap[f.clientId]
        })));
        console.log(`Seeded ${files.length} client files`);

        // Seed Notes
        await Note.insertMany(notesData.map(n => ({
            ...n,
            id: undefined,
            clientId: clientMap[n.clientId],
            authorId: managerMap[n.authorId]
        })));
        console.log(`Seeded ${notesData.length} client notes`);

        // Seed Jobs
        await Job.insertMany(jobPositions.map(j => ({
            ...j,
            id: undefined
        })));
        console.log(`Seeded ${jobPositions.length} job positions`);

        // Seed Milestones
        await Milestone.insertMany(companymilestones.map(m => ({
            ...m,
            id: undefined
        })));
        console.log(`Seeded ${companymilestones.length} milestones`);

        // Seed BlogPosts
        await BlogPost.insertMany(allBlogPosts.map(post => ({
            ...post,
            id: undefined,
            status: 'published'
        })));
        console.log(`Seeded ${allBlogPosts.length} blog posts`);

        // Seed Services
        await Service.insertMany(allServices.map(service => ({
            ...service,
            serviceId: service.id,
            id: undefined
        })));
        console.log(`Seeded ${allServices.length} services`);

        // Seed PricingPlans
        await PricingPlan.insertMany(plans.map(plan => ({
            ...plan,
            planId: plan.id,
            id: undefined,
            features: planFeatures.map(f => ({
                text: f.text,
                value: f.values[plan.id],
                included: f.included.includes(plan.id)
            })),
            order: plans.indexOf(plan)
        })));
        console.log(`Seeded ${plans.length} pricing plans`);

        // Seed FAQs
        await FAQ.insertMany(allFAQs.map(faq => ({
            question: faq.question,
            answer: faq.answer,
            categories: faq.categories,
            order: faq.order || 0
        })));
        console.log(`Seeded ${allFAQs.length} FAQs`);

        // Seed Testimonials
        await Testimonial.insertMany(allTestimonials.map(t => ({
            type: t.type || 'social',
            category: t.category || 'General',
            author: {
                name: t.author.name,
                role: t.author.role,
                company: t.author.company,
                handle: t.author.handle,
                image: t.author.image
            },
            content: t.content,
            quote: t.content,
            rating: t.rating || 5,
            metric: t.metric,
            featured: t.featured || false,
            order: t.order || 0
        })));
        console.log(`Seeded ${allTestimonials.length} testimonials`);

        // Seed Tasks
        await Task.insertMany(allTasks.map(task => ({
            ...task,
            taskId: `T-${task.id}`,
            id: undefined,
            client: {
                name: task.client,
                id: clientMap[task.clientId]
            },
            assignee: {
                name: task.owner,
                id: managerMap[task.managerId] || managerMap[task.owner]
            },
            status: task.status === 'in-progress' ? 'In Progress' : (task.status === 'completed' ? 'Completed' : 'To Do'),
            updates: (task.activity || []).map(a => ({
                user: a.user,
                message: a.content,
                date: new Date()
            }))
        })));
        console.log(`Seeded ${allTasks.length} tasks`);

        // Seed Invoices
        await Invoice.insertMany(invoices.map(inv => ({
            invoiceNumber: inv.id,
            client: {
                name: inv.client,
                id: clientMap[inv.clientId]
            },
            amount: inv.amount,
            status: inv.status === 'paid' ? 'Paid' : 'Pending',
            date: inv.date,
            dueDate: inv.dueDate,
            items: [{ description: `${inv.plan} Subscription`, qty: 1, price: inv.amount, total: inv.amount }]
        })));
        console.log(`Seeded ${invoices.length} invoices`);

        // Seed TeamMembers
        await TeamMember.insertMany(teammembers.map(tm => ({
            ...tm,
            id: undefined,
            category: tm.category === 'Core Leadership' ? 'Leadership Team' : tm.category
        })));
        console.log(`Seeded ${teammembers.length} team members`);

        // Seed CatalogServices
        await CatalogService.insertMany(servicesCatalog.map(s => ({
            ...s,
            serviceId: s.id,
            id: undefined
        })));
        console.log(`Seeded ${servicesCatalog.length} catalog services`);

        // Seed ActivityLogs
        await ActivityLog.insertMany(activityLogs.map(log => ({
            user: {
                name: log.user,
                id: managerMap[log.adminId]
            },
            action: log.action,
            target: log.task,
            details: `Task ID: ${log.taskId}`,
            timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
            type: log.type === 'task' ? 'user' : log.type
        })));
        console.log(`Seeded ${activityLogs.length} activity logs`);

        // Seed Notifications
        const superAdminNotifs = mockNotifications.superAdmin.map(n => ({
            recipientId: superAdmin._id,
            title: n.title,
            message: n.message,
            type: n.type === 'alert' ? 'warning' : (n.type === 'info' ? 'info' : 'success'),
            read: n.isRead,
            link: n.actionUrl
        }));

        await Notification.insertMany(superAdminNotifs);
        console.log(`Seeded ${superAdminNotifs.length} notifications`);

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
