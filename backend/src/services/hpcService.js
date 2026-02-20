const axios = require('axios');

const HPC_API_URL = process.env.HPC_API_URL || 'http://127.0.0.1:7860/generate';

exports.generateImage = async (prompt) => {
  try {
    const response = await axios.post(HPC_API_URL, {
      prompt: prompt
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.status === 'success') {
      return {
        success: true,
        image_base64: response.data.image_base64,
        model_time: response.data.model_loaded_in_seconds,
        gen_time: response.data.image_generation_seconds
      };
    } else {
      throw new Error('API returned unsuccessful status');
    }
  } catch (error) {
    console.error('HPC API Error:', error.message);
    throw new Error('Failed to generate image from external model.');
  }
};
