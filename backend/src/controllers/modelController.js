const CustomModel = require('../models/customModel');

exports.createModel = async (req, res, next) => {
    try {
        const { name, provider, apiKey, modelId, endpointUrl } = req.body;
        const userId = req.userId;

        if (!name || !provider || !apiKey) {
            return res.status(400).json({ success: false, message: 'Name, provider, and API key are required' });
        }

        // Check for duplicate names for this user
        const existingModel = await CustomModel.findOne({ userId, name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingModel) {
            return res.status(400).json({ success: false, message: 'A model with this name already exists' });
        }

        const newModel = new CustomModel({
            userId,
            name,
            provider,
            apiKey,
            modelId,
            endpointUrl
        });

        await newModel.save();

        res.status(201).json({
            success: true,
            message: 'Model added successfully',
            model: {
                id: newModel._id,
                name: newModel.name,
                provider: newModel.provider,
                modelId: newModel.modelId,
                isActive: newModel.isActive
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getModels = async (req, res, next) => {
    try {
        const userId = req.userId;
        const models = await CustomModel.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            models: models.map(m => ({
                id: m._id,
                name: m.name,
                provider: m.provider,
                modelId: m.modelId,
                endpointUrl: m.endpointUrl,
                isActive: m.isActive,
                createdAt: m.createdAt
            }))
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteModel = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const deleted = await CustomModel.findOneAndDelete({ _id: id, userId });

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Model not found or unauthorized' });
        }

        res.status(200).json({
            success: true,
            message: 'Model deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
