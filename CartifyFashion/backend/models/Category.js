import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: String,
  subcategory: String
});

export default mongoose.model("Category", categorySchema);