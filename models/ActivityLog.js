import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
    user: {
        name: { type: String },
        role: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    action: { type: String, required: true },
    target: { type: String },
    details: { type: String },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['system', 'user', 'client', 'task', 'file', 'note'], default: 'user' }
}, { timestamps: true });

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
