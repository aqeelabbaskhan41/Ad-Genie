const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/AdGenie',
    JWT_SECRET: process.env.JWT_SECRET || 'adgenie_123',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '1d',
    NODE_ENV: process.env.NODE_ENV || 'development'
};