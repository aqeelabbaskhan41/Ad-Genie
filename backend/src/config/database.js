const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/AdGenie';
    
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;