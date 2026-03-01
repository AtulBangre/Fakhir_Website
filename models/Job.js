import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    department: { type: String },
    location: { type: String, default: 'Remote' },
    type: { type: String, default: 'Full-time' },
    experience: { type: String },
    description: { type: String },
    requirements: [{ type: String }],
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
