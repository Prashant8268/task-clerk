import mongoose from 'mongoose';

const { Schema } = mongoose;

const cardSchema = new Schema({
    text: { type: String, required: true }
});

const Card = mongoose.model('Card', cardSchema);

export default Card;