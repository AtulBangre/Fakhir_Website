import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    tagline: { type: String },
    established: { type: String },
    description: { type: String },
    mission: { type: String },
    vision: { type: String },
    badges: [{
        title: { type: String },
        subtitle: { type: String }
    }],
    stats: [{
        value: { type: String },
        label: { type: String },
        description: { type: String }
    }],
    contact: {
        address: {
            street: { type: String },
            area: { type: String },
            city: { type: String },
            state: { type: String },
            zip: { type: String },
            country: { type: String },
            full: { type: String }
        },
        phone: {
            primary: { type: String },
            secondary: { type: String },
            whatsapp: { type: String }
        },
        email: {
            info: { type: String },
            support: { type: String },
            general: { type: String }
        },
        social: {
            linkedin: { type: String },
            facebook: { type: String },
            instagram: { type: String },
            twitter: { type: String }
        },
        hours: {
            weekdays: { type: String },
            weekend: { type: String }
        }
    },
    story: {
        title: { type: String },
        content: { type: String },
        highlights: [{ type: String }]
    },
    culture: {
        title: { type: String },
        values: [{
            title: { type: String },
            description: { type: String }
        }]
    },
    partners: [{
        name: { type: String },
        logo: { type: String }
    }]
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
