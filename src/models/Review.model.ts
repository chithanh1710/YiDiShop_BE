import mongoose, { Document, Schema } from "mongoose";
import Product, { IProduct } from "./Product.model";
import { IUser } from "./User.model";

// Định nghĩa TypeScript Interface cho Review
export interface IReview extends Document {
  _id: Schema.Types.ObjectId;
  user: IUser["_id"];
  product: IProduct["_id"];
  rating: number; // Rating từ 1 đến 5
  comment?: string; // Bình luận của người dùng
  createAt: Date;
}

const reviewSchema: Schema<IReview> = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Review must belong to a product"],
  },
  rating: {
    type: Number,
    required: [true, "Review must have a rating"],
    min: [1, "Rating cannot be less than 1"],
    max: [5, "Rating cannot be more than 5"],
  },
  comment: {
    type: String,
    trim: true,
  },
  createAt: {
    type: Date,
    default: () => new Date(),
  },
});

// Middleware để tính toán và cập nhật rating trung bình cho sản phẩm
reviewSchema.pre("save", async function (next) {
  if (!this.isModified("rating")) return next();

  const product = await Product.findById(this.product);
  if (!product) return next();

  const reviews = await Review.find({ product: this.product });
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(this.product, {
    averageRating: averageRating,
  });

  next();
});

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
