import mongoose, { Schema } from "mongoose";

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  description: { type: String },
  images: [{ type: String }],
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  averageRating: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

RestaurantSchema.index({ location: "2dsphere" }); // Index cho tìm kiếm địa lý

export default mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);
