import mongoose, { Document, Query, Schema } from "mongoose";
import { IProduct } from "./Product.model";

// Định nghĩa TypeScript Interface cho Category
export interface ICategory extends Document {
  name: string;
  description?: string;
  createAt: Date;
}

// Định nghĩa Schema cho Category
const categorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
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
  createAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre<Query<IProduct, IProduct>>(/^find/, function (next) {
  // this.populate({
  //   path: "category",
  //   select: "name description",
  // });
  next();
});

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
