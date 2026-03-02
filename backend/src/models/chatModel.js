const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant', 'system', 'tool'],
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'tool_call'],
        default: 'text'
    },
    content: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: null
    },
    tool_call_id: {
        type: String, // For tool call responses
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow anonymous sessions if needed, but standard is linked to User
    },
    sessionId: {
        type: String,
        required: false // Fallback if no user is logged in
    },
    messages: [messageSchema],
    title: {
        type: String,
        default: 'New Chat'
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
chatSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
