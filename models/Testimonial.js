import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
    type: { type: String, enum: ['detailed', 'social'], default: 'social' },
    category: { type: String, default: 'General' },
    author: {
        name: { type: String, required: true },
        role: { type: String },
        company: { type: String },
        handle: { type: String },
        image: { type: String }
    },
    content: { type: String, required: true, alias: 'quote', maxlength: 200 },
    rating: { type: Number, default: 5 },
    metric: {
        label: { type: String },
        value: { type: String }
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
}, { timestamps: true });

// Middleware to sync content and quote
TestimonialSchema.pre('save', function (next) {
    if (this.quote && !this.content) this.content = this.quote;
    if (this.content && !this.quote) this.quote = this.content;
    next();
});

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
