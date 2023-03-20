import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: "string", require: true },
    email: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
    isAdmin: { type: "boolean", required: true, default: false },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
