import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    categories: {
        home: { type: Boolean, default: false },
        pricing: { type: Boolean, default: false },
        dashboard: { type: Boolean, default: false }
    },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);
