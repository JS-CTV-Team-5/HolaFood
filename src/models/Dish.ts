import mongoose, { Schema } from "mongoose";

const DishSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }],
  restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  averageRating: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Dish || mongoose.model("Dish", DishSchema);

