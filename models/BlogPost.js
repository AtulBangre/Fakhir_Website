import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String },
    category: { type: String },
    author: {
        name: { type: String },
        role: { type: String },
        image: { type: String }
    },
    publishDate: { type: String },
    readTime: { type: String },
    slug: { type: String, unique: true, required: true },
    thumbnail: { type: String },
    tags: [{ type: String }],
    content: { type: String },
    status: { type: String, enum: ['published', 'draft'], default: 'published' }
}, { timestamps: true });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
