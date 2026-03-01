import mongoose from 'mongoose';

const ProfileUpdateRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Relaxed requirement
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    userName: String,
    userRole: String,
    oldData: mongoose.Schema.Types.Mixed,
    newData: mongoose.Schema.Types.Mixed,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminNotes: String
}, {
    timestamps: true,
    collection: 'profileupdaterequests',
    strict: false // Allow fields not in schema
});

// Avoid model recompilation error
const ProfileUpdateRequest = mongoose.models.ProfileUpdateRequest || mongoose.model('ProfileUpdateRequest', ProfileUpdateRequestSchema);

export default ProfileUpdateRequest;
