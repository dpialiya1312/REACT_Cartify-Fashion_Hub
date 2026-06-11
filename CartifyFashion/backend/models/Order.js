import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  items: Array,
  total: Number,
  address: Object,
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);