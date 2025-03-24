import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  dishId: { type: Schema.Types.ObjectId, ref: "Dish" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  images: [{ type: String }],
  likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
