const hpcService = require('../services/hpcService');

exports.generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const result = await hpcService.generateImage(prompt);
    
    // Construct the data URI for the frontend
    const imageUrl = `data:image/png;base64,${result.image_base64}`;

    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      modelTime: result.model_time,
      genTime: result.gen_time,
      prompt: prompt
    });
  } catch (error) {
    next(error);
  }
};
