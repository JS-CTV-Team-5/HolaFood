import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetToken: { type: String, default: null },
});

UserSchema.methods.comparePassword = async function (password: string) {
  return this.password === password;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);