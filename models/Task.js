// models/Task.js
import mongoose from 'mongoose';
import Card from './Card';
const { Schema } = mongoose;

const taskSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'done'], default: 'pending' },
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' }
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);


export default Task;