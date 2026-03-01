import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    sla: {
        taskResponseTime: { type: Number, default: 24 },
        unassignedClientAlert: { type: Number, default: 24 },
        emergencyResponseTime: { type: Number, default: 2 },
        taskEscalationThreshold: { type: Number, default: 3 }
    },
    emailNotifications: {
        newClientSignup: { type: Boolean, default: true },
        taskOverdueAlert: { type: Boolean, default: true },
        unassignedClientAlert: { type: Boolean, default: true },
        weeklySummaryReport: { type: Boolean, default: true }
    },
    system: {
        maintenanceMode: { type: Boolean, default: false },
        autoAssignNewClients: { type: Boolean, default: false },
        twoFactorAuthentication: { type: Boolean, default: true }
    },
    defaults: {
        taskPriority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
        taskETADays: { type: Number, default: 7 },
        maxClientsPerManager: { type: Number, default: 10 },
        sessionTimeout: { type: Number, default: 60 }
    }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
