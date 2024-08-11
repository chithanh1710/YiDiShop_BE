import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./Product.model";

export interface IBrand extends Document {
  _id: Schema.Types.ObjectId;
  name:
    | "Apple"
    | "Samsung"
    | "Xiaomi"
    | "Vivo"
    | "Oppo"
    | "Huawei"
    | "Realme"
    | "Sony";
  numProduct: number;
  products: IProduct["_id"][];
  description?: string;
  createAt: Date;
}

const brandSchema: Schema<IBrand> = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    enum: [
      "Apple",
      "Samsung",
      "Xiaomi",
      "Vivo",
      "Oppo",
      "Huawei",
      "Realme",
      "Sony",
    ],
    required: [true, "A brand must have a name"],
    unique: true,
    trim: true,
    maxlength: [50, "A brand name must have less or equal than 50 characters"],
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

const Brand = mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;
