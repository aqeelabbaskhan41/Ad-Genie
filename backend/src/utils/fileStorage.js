const fs = require('fs');
const path = require('path');

// Ensure the directory exists
const uploadDir = path.join(__dirname, '../../uploads/generated_images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Saves a base64 encoded image to the local filesystem
 * @param {string} base64String The base64 encoded image string
 * @param {string} timestamp The timestamp to use in the filename
 * @returns {string} The URL path to access the image
 */
exports.saveBase64Image = (base64String, timestamp = Date.now()) => {
    try {
        const filename = `ad_image_${timestamp}.png`;
        const filepath = path.join(uploadDir, filename);
        
        // Remove header if present (e.g. data:image/png;base64,)
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        
        fs.writeFileSync(filepath, buffer);
        
        // Return a relative path that can be served statically by Express
        return `/uploads/generated_images/${filename}`;
    } catch (error) {
        console.error("Error saving image:", error);
        throw new Error("Failed to save generated image locally.");
    }
};
