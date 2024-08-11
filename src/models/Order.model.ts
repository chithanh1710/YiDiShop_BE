import mongoose, { Document, Query, Schema } from "mongoose";
import { IUser } from "./User.model";
import { IProduct } from "./Product.model";

export interface IOrder extends Document {
  _id: Schema.Types.ObjectId;
  user: IUser["_id"];
  products: {
    product: IProduct["_id"];
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  createAt: Date;
  paymentMethod: "credit card" | "paypal" | "cash";
  address: string;
}

// Định nghĩa Schema cho Order
const orderSchema: Schema<IOrder> = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Order must belong to a user"],
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Order must contain products"],
      },
      quantity: {
        type: Number,
        required: [true, "Order must have a product quantity"],
        min: [1, "Quantity cannot be less than 1"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Order must have a total price"],
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  createAt: {
    type: Date,
    default: () => new Date(),
  },
  paymentMethod: {
    type: String,
    enum: ["credit card", "paypal", "cash"],
    default: "credit card",
  },
  address: {
    type: String,
    required: [true, "Order must have a delivery address"],
  },
});

// Middleware để tự động populate user và products khi query
orderSchema.pre<Query<IOrder, IOrder>>(/^find/, function (next) {
  this.populate("user").populate({
    path: "products.product",
    select: "name price priceDiscount",
  });
  next();
});

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
