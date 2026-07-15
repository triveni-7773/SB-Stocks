const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sbstocks';
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('MongoDB connection unavailable. Continuing in demo mode:', error.message);
  }
};

module.exports = connectDB;
