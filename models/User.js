import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    plainPassword: { type: String },
    phone: { type: String },
    role: {
        type: String,
        enum: ['super-admin', 'admin', 'client'],
        required: true
    },
    // Admin specific fields
    adminRole: { type: String }, // e.g., 'Account Manager', 'Senior Manager'
    team: { type: String },
    teamId: { type: Number },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    permissions: [{ type: String }],
    performance: {
        activeTasks: { type: Number, default: 0 },
        completedTasks: { type: Number, default: 0 },
        clientSatisfaction: { type: String }
    },
    // Client specific fields
    company: { type: String },
    gstNo: { type: String },
    plan: { type: String },
    supportType: {
        type: String,
        enum: ['Normal', 'Within 2 Hours'],
        default: 'Normal'
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'disabled'],
        default: 'active'
    },
    manager: { type: String },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    salesManager: { type: String },
    spCentralRequestId: { type: String },
    marketplace: { type: String },
    userPermission: { type: String },
    accountAccessUrl: { type: String },
    leadSource: { type: String },
    listingManager: { type: String },
    location: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: 'India' },
    subscribedServices: [{
        serviceId: { type: String },
        name: { type: String },
        subscribedDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['active', 'expired', 'cancelled', 'in-progress', 'completed'], default: 'active' },
        type: { type: String, enum: ['standard', 'priority'], default: 'standard' }
    }],
    joinedDate: { type: Date, default: Date.now },
    paymentMethods: [{
        brand: { type: String, default: 'Visa' }, // Visa, Mastercard, American Express
        last4: { type: String },
        expiry: { type: String },
        cardholderName: { type: String },
        isDefault: { type: Boolean, default: false },
        providerId: { type: String }, // For Stripe/PayPal payment method IDs
        createdAt: { type: Date, default: Date.now }
    }],
    notificationSettings: {
        soundEnabled: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: false },
        taskUpdates: { type: Boolean, default: true },
        paymentAlerts: { type: Boolean, default: true },
        marketingNews: { type: Boolean, default: false },
        weeklyDigest: { type: Boolean, default: true }
    },
    pushSubscriptions: [{
        endpoint: { type: String, required: true },
        keys: {
            p256dh: { type: String, required: true },
            auth: { type: String, required: true }
        },
        createdAt: { type: Date, default: Date.now }
    }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
