import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
};
