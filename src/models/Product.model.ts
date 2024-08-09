import mongoose, { Document, Query, Schema } from "mongoose";
import { ICategory } from "./Category.model";

// Định nghĩa TypeScript Interface cho Product
export interface IProduct extends Document {
  name: string;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  category: ICategory["_id"];
  stockQuantity: number;
  createAt: Date;
}

// Định nghĩa Schema cho Product
const productSchema: Schema<IProduct> = new Schema({
  name: {
    type: String,
    required: [true, "A product must have a name"],
    trim: true,
    unique: true,
    maxlength: [
      100,
      "A product name must have less or equal than 100 characters",
    ],
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (this: IProduct, val: number) {
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be below regular price",
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "A product must have a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A product must have a cover image"],
  },
  images: [String],
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "A product must belong to a category"],
  },
  stockQuantity: {
    type: Number,
    required: [true, "A product must have a stock quantity"],
    min: [0, "Stock quantity cannot be less than 0"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre<Query<ICategory, ICategory>>(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name description",
  });
  next();
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
