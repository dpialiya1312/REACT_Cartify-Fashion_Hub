import mongoose from "mongoose";
import process from "node:process";


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/cartifydb"
);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};


export default connectDB;
