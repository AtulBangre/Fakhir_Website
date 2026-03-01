import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    serviceId: { type: String, unique: true, required: true }, // e.g., 'account-management'
    title: { type: String, required: true },
    shortDescription: { type: String },
    fullDescription: { type: String },
    icon: { type: String },
    features: [{ type: String }],
    benefits: [{ type: String }],
    category: { type: String },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
