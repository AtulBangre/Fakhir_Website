import mongoose from 'mongoose';

const WebPageSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        enum: ['privacy-policy', 'terms-conditions']
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }, // HTML content from ReactQuill
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.models.WebPage || mongoose.model('WebPage', WebPageSchema);
