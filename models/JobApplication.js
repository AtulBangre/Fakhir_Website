import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: String,
    resume: String, // URL to the uploaded resume
    coverLetter: String,
    jobTitle: String,
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: false
    },
    status: {
        type: String,
        enum: ['applied', 'reviewing', 'shortlisted', 'rejected'],
        default: 'applied'
    }
}, { timestamps: true });

export default mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
