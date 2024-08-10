import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./Product.model";

// Định nghĩa TypeScript Interface cho Category
export interface ICategory extends Document {
  _id: Schema.Types.ObjectId;
  name:
    | "Electronics"
    | "Books"
    | "Fashion"
    | "Home & Kitchen"
    | "Sports"
    | "Toys"
    | "Beauty"
    | "Health"
    | "Automotive"
    | "Gaming";
  numProduct: number;
  products: IProduct["_id"][];
  description?: string;
  createAt: Date;
}

// Định nghĩa Schema cho Category
const categorySchema: Schema<ICategory> = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    enum: [
      "Electronics",
      "Books",
      "Fashion",
      "Home & Kitchen",
      "Sports",
      "Toys",
      "Beauty",
      "Gaming",
      "Automotive",
      "Health",
    ],
    required: [true, "A category must have a name"],
    unique: true,
    trim: true,
    maxlength: [
      50,
      "A category name must have less or equal than 50 characters",
    ],
  },
  description: {
    type: String,
    trim: true,
  },
  numProduct: {
    type: Number,
    default: 0,
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: "Product",
  },
  createAt: {
    type: Date,
    default: () => new Date(),
  },
});

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
