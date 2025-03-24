import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reviewId: { type: Schema.Types.ObjectId, ref: "Review" },
  restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  dishId: { type: Schema.Types.ObjectId, ref: "Dish" },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
