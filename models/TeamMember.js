import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String },
    bio: { type: String },
    socials: {
        linkedin: { type: String },
        twitter: { type: String },
        email: { type: String }
    },
    category: {
        type: String,
        enum: ['Core Leadership', 'Leadership Team', 'Senior Management', 'Our Rising Stars', 'Rising Stars'],
        default: 'Rising Stars'
    },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
