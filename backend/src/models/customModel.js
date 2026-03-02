const mongoose = require('mongoose');

const customModelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    provider: {
        type: String,
        enum: ['openai', 'anthropic', 'stability', 'midjourney', 'custom', 'hpc', 'huggingface', 'google'],
        required: true
    },
    apiKey: {
        type: String,
        required: true
    },
    modelId: {
        type: String,
        default: null // e.g., 'dall-e-3', 'sdxl', 'runwayml/stable-diffusion-v1-5'
    },
    endpointUrl: {
        type: String,
        default: null // For 'custom' provider
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CustomModel = mongoose.model('CustomModel', customModelSchema);
module.exports = CustomModel;
