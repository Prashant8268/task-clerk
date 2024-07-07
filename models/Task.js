// models/Task.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }]
});

const Task = mongoose.model('Task', taskSchema);

export default Task;