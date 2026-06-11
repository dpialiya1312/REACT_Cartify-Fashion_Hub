import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  gender: String,
  address: String,
  image: String,
  resetOTP: String,
  otpExpire: Date
});

export default mongoose.model("User", userSchema);