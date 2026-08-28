const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_cms');
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries -= 1;
      console.error(`⚠️ MongoDB Connection Error (${error.message}). Retries left: ${retries}`);
      if (retries === 0) {
        console.error('❌ Could not connect to MongoDB after multiple attempts.');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
};

module.exports = connectDB;
