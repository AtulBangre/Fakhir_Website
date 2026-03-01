import mongoose from 'mongoose';
import WebPage from '../models/WebPage.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const pages = [
    {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        content: `
            <h1>Privacy Policy</h1>
            <p>Last Updated: ${new Date().toLocaleDateString()}</p>
            <h2>1. Introduction</h2>
            <p>Welcome to Fakhri IT Services. We value your privacy and are committed to protecting your personal data.</p>
            <h2>2. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support.</p>
            <h3>2.1 Personal Data</h3>
            <p>Includes name, email address, phone number, and billing information.</p>
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to provide our services, process transactions, and communicate with you.</p>
            <h2>4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data.</p>
        `
    },
    {
        slug: 'terms-conditions',
        title: 'Terms & Conditions',
        content: `
            <h1>Terms & Conditions</h1>
            <p>Last Updated: ${new Date().toLocaleDateString()}</p>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing our services, you agree to be bound by these Terms & Conditions.</p>
            <h2>2. Services Provided</h2>
            <p>Fakhri IT Services provides Amazon seller services, ads management, and related IT consulting.</p>
            <h2>3. Payment Terms</h2>
            <p>Payments for services are due according to the selected pricing plan. All fees are non-refundable unless stated otherwise.</p>
            <h2>4. Limitation of Liability</h2>
            <p>Fakhri IT Services is not liable for any indirect or consequential damages arising from the use of our services.</p>
        `
    },
    {
        slug: 'refund-policy',
        title: 'Refund Policy',
        content: `
            <h1>Refund Policy</h1>
            <p>Last Updated: ${new Date().toLocaleDateString()}</p>
            <p>At Fakhri IT Services, we strive to provide the best possible service to our clients. Please review our refund policy below:</p>
            <h2>1. Service-Based Refunds</h2>
            <p>Refunds for services are generally only provided if we fail to deliver the agreed-upon scope of work. No refunds will be issued once the service has been completed.</p>
            <h2>2. Subscription Refunds</h2>
            <p>Subscription fees are non-refundable for the current billing cycle. You may cancel your subscription at any time to prevent future charges.</p>
            <h2>3. Refund Process</h2>
            <p>To request a refund, please contact our support team at support@fakhri.com with your order details and reason for the request.</p>
            <h2>4. Policy Updates</h2>
            <p>We reserve the right to modify this refund policy at any time. Any changes will be posted on this page.</p>
        `
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        for (const page of pages) {
            await WebPage.findOneAndUpdate(
                { slug: page.slug },
                { $set: page },
                { upsert: true, new: true }
            );
            console.log(`Seeded ${page.title}`);
        }

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
