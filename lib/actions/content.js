'use server';
import { revalidatePath } from 'next/cache';

import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import FAQ from '@/models/FAQ';
import TeamMember from '@/models/TeamMember';
import Testimonial from '@/models/Testimonial';
import PricingPlan from '@/models/PricingPlan';
import Company from '@/models/Company';
import Milestone from '@/models/Milestone';
import Job from '@/models/Job';
import CatalogService from '@/models/CatalogService';
import WebPage from '@/models/WebPage';
import { normalizePeriod } from '@/lib/utils';

export async function getServices() {
    await connectDB();
    try {
        const services = await Service.find({}).sort({ order: 1 }).lean();
        return JSON.parse(JSON.stringify(services));
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

export async function getCatalogServices() {
    await connectDB();
    try {
        const services = await CatalogService.find({}).sort({ serviceId: 1 }).lean();
        return JSON.parse(JSON.stringify(services));
    } catch (error) {
        console.error('Error fetching catalog services:', error);
        return [];
    }
}

export async function getFAQs(category = '') {
    await connectDB();
    try {
        const query = category ? { [`categories.${category}`]: true } : {};
        const faqs = await FAQ.find(query).sort({ order: 1 }).lean();
        return JSON.parse(JSON.stringify(faqs));
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }
}

export async function getTeamMembers() {
    await connectDB();
    try {
        const members = await TeamMember.find({}).sort({ category: 1, order: 1 }).lean();
        return JSON.parse(JSON.stringify(members));
    } catch (error) {
        console.error('Error fetching team members:', error);
        return [];
    }
}

export async function getTestimonials() {
    await connectDB();
    try {
        const testimonials = await Testimonial.find({}).lean();
        return JSON.parse(JSON.stringify(testimonials));
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

export async function getPricingPlans() {
    await connectDB();
    try {
        const order = ['elite', 'premium', 'platinum'];
        const plans = await PricingPlan.find({}).lean();

        // Normalize periods and sort
        const sortedPlans = plans.map(plan => ({
            ...plan,
            period: normalizePeriod(plan.period)
        })).sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined && a.order !== b.order) {
                return a.order - b.order;
            }
            const indexA = order.indexOf(a.planId);
            const indexB = order.indexOf(b.planId);
            return (indexA > -1 ? indexA : 99) - (indexB > -1 ? indexB : 99);
        });

        return JSON.parse(JSON.stringify(sortedPlans));
    } catch (error) {
        console.error('Error fetching pricing plans:', error);
        return [];
    }
}

export async function getCompanyData() {
    await connectDB();
    try {
        const company = await Company.findOne({}).lean();
        return company ? JSON.parse(JSON.stringify(company)) : null;
    } catch (error) {
        console.error('Error fetching company data:', error);
        return null;
    }
}

export async function getMilestones() {
    await connectDB();
    try {
        const milestones = await Milestone.find({}).sort({ order: 1 }).lean();
        return JSON.parse(JSON.stringify(milestones));
    } catch (error) {
        console.error('Error fetching milestones:', error);
        return [];
    }
}

export async function getJobs() {
    await connectDB();
    try {
        const jobs = await Job.find({ status: 'open' }).sort({ order: 1 }).lean();
        return JSON.parse(JSON.stringify(jobs));
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}
export async function updateCompanyData(data) {
    await connectDB();
    try {
        const company = await Company.findOneAndUpdate({}, data, { upsert: true, new: true }).lean();
        return JSON.parse(JSON.stringify(company));
    } catch (error) {
        console.error('Error updating company data:', error);
        return null;
    }
}

export async function upsertTeamMember(member) {
    await connectDB();
    try {
        const id = member._id || member.id;
        let updated;
        if (id && id.toString().length >= 12) {
            updated = await TeamMember.findByIdAndUpdate(id, member, { new: true, upsert: true }).lean();
        } else {
            const { _id, id: oldId, ...rest } = member;
            updated = await TeamMember.create(rest);
        }
        return JSON.parse(JSON.stringify(updated));
    } catch (error) {
        console.error('Error upserting team member:', error);
        return null;
    }
}

export async function deleteTeamMember(id) {
    await connectDB();
    try {
        await TeamMember.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting team member:', error);
        return { success: false };
    }
}

export async function upsertPricingPlan(plan) {
    await connectDB();
    try {
        // Normalize period before saving
        if (plan.period) {
            plan.period = normalizePeriod(plan.period);
        }
        const id = plan._id || plan.id;
        let updated;
        if (id && id.toString().length >= 12) {
            updated = await PricingPlan.findByIdAndUpdate(id, plan, { new: true, upsert: true }).lean();
        } else {
            const { _id, id: oldId, ...rest } = plan;
            updated = await PricingPlan.create(rest);
        }
        revalidatePath('/');
        return JSON.parse(JSON.stringify(updated));
    } catch (error) {
        console.error('Error upserting pricing plan:', error);
        return null;
    }
}

export async function upsertService(service) {
    await connectDB();
    try {
        const id = service._id || service.id;
        let updated;
        if (id && id.toString().length >= 12) {
            updated = await Service.findByIdAndUpdate(id, service, { new: true, upsert: true }).lean();
        } else {
            const { _id, id: oldId, ...rest } = service;
            updated = await Service.create(rest);
        }
        return JSON.parse(JSON.stringify(updated));
    } catch (error) {
        console.error('Error upserting service:', error);
        return null;
    }
}

export async function deleteService(id) {
    await connectDB();
    try {
        await Service.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting service:', error);
        return { success: false };
    }
}

export async function upsertTestimonial(testimonial) {
    await connectDB();
    try {
        const id = testimonial._id || testimonial.id;
        let updated;
        if (id && id.toString().length >= 12) {
            updated = await Testimonial.findByIdAndUpdate(id, testimonial, { new: true, upsert: true }).lean();
        } else {
            const { _id, id: oldId, ...rest } = testimonial;
            updated = await Testimonial.create(rest);
        }
        return JSON.parse(JSON.stringify(updated));
    } catch (error) {
        console.error('Error upserting testimonial:', error);
        return null;
    }
}

export async function deleteTestimonial(id) {
    await connectDB();
    try {
        await Testimonial.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return { success: false };
    }
}

export async function upsertFAQ(faq) {
    await connectDB();
    try {
        const id = faq._id || faq.id;
        let updated;
        if (id && id.toString().length >= 12) {
            updated = await FAQ.findByIdAndUpdate(id, faq, { new: true, upsert: true }).lean();
        } else {
            const { _id, id: oldId, ...rest } = faq;
            updated = await FAQ.create(rest);
        }
        return JSON.parse(JSON.stringify(updated));
    } catch (error) {
        console.error('Error upserting FAQ:', error);
        return null;
    }
}

export async function deleteFAQ(id) {
    await connectDB();
    try {
        await FAQ.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        return { success: false };
    }
}

export async function upsertJob(job) {
    await connectDB();
    try {
        const id = job._id || job.id;
        let updated;
        if (id && id.toString().length >= 12) {
            updated = await Job.findByIdAndUpdate(id, job, { new: true, upsert: true }).lean();
        } else {
            const { _id, id: oldId, ...rest } = job;
            updated = await Job.create(rest);
        }
        return JSON.parse(JSON.stringify(updated));
    } catch (error) {
        console.error('Error upserting job:', error);
        return null;
    }
}


export async function deleteJob(id) {
    await connectDB();
    try {
        await Job.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting job:', error);
        return { success: false };
    }
}

export async function upsertCatalogService(service) {
    await connectDB();
    try {
        const id = service._id || service.id;
        let updated;
        if (id && id.toString().length >= 12) {
            updated = await CatalogService.findByIdAndUpdate(id, service, { new: true, upsert: true }).lean();
        } else {
            const { _id, id: oldId, ...rest } = service;
            updated = await CatalogService.create(rest);
        }
        return JSON.parse(JSON.stringify(updated));
    } catch (error) {
        console.error('Error upserting catalog service:', error);
        return null;
    }
}

export async function deleteCatalogService(id) {
    await connectDB();
    try {
        await CatalogService.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting catalog service:', error);
        return { success: false };
    }
}

export async function getWebPage(slug) {
    await connectDB();
    try {
        const page = await WebPage.findOne({ slug }).lean();
        return page ? JSON.parse(JSON.stringify(page)) : null;
    } catch (error) {
        console.error(`Error fetching web page ${slug}:`, error);
        return null;
    }
}

export async function upsertWebPage(data) {
    await connectDB();
    try {
        const page = await WebPage.findOneAndUpdate(
            { slug: data.slug },
            { ...data, lastUpdated: new Date() },
            { upsert: true, new: true }
        ).lean();
        revalidatePath(`/${data.slug}`);
        return JSON.parse(JSON.stringify(page));
    } catch (error) {
        console.error(`Error upserting web page ${data.slug}:`, error);
        return null;
    }
}
