import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    googleId: { type: String },
    resetToken: String,
    resetTokenExpire: Date
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
