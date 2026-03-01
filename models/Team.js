import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    lead: { type: String },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    clientCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
