const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Null if anonymous user
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: false // Link to the chat where it was generated
    },
    prompt: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        default: 'AdGenie'
    },
    likes: {
        type: Number,
        default: 0
    },
    engagement: {
        type: String,
        default: "0% CTR"
    },
    genTime: {
        type: Number, // Seconds
        default: 0
    },
    modelTime: {
        type: Number, // Seconds
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
