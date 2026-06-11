import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: String,
  productName: String,   // ✅ ADD THIS
  userName: String,
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Review", reviewSchema);