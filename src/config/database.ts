import mongoose from "mongoose"
export const connectToDatabase = async (MONGOURI: string) => {
    try {
      await mongoose.connect(MONGOURI);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
  
      process.exit(1);
    }
  };