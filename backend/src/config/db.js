import mongoose from 'mongoose';

const connectDB = async () => {
  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aquasense');
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      console.log('Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    }
  };

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
  });

  await connectWithRetry();
};

export default connectDB;
