import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error', 'task', 'invoice', 'feedback', 'contact', 'career'],
        default: 'info'
    },
    icon: { type: String },
    read: { type: Boolean, default: false },
    link: { type: String }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
