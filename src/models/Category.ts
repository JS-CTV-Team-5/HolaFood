import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ["restaurant", "dish"], required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
