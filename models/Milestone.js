import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Milestone || mongoose.model('Milestone', MilestoneSchema);
