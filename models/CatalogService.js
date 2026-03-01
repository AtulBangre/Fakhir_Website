import mongoose from 'mongoose';

const CatalogServiceSchema = new mongoose.Schema({
    serviceId: { type: String, unique: true, required: true }, // e.g., 'account-suspension'
    name: { type: String, required: true },
    category: { type: String, required: true },
    pricing: {
        standard: {
            price: { type: Number },
            label: { type: String }
        },
        priority: {
            price: { type: Number },
            label: { type: String }
        }
    }
}, { timestamps: true });

export default mongoose.models.CatalogService || mongoose.model('CatalogService', CatalogServiceSchema);
