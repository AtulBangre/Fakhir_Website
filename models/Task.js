import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    taskId: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'In Review', 'Completed', 'On Hold'],
        default: 'To Do'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low', 'Urgent'],
        default: 'Medium'
    },
    client: {
        name: { type: String },
        company: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    assignee: {
        name: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    owner: { type: String },
    dueDate: { type: String },
    category: { type: String },
    tags: [{ type: String }],
    planForWeek: { type: String },
    attachment: {
        name: { type: String },
        url: { type: String }
    },
    updates: [{
        user: { type: String },
        message: { type: String },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Task;
}
export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
