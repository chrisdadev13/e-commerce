import { Document, Model, Schema, Types, model } from "mongoose";

export enum Status {
  Pending = "Pending",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
}

export interface Order {
  user: Types.ObjectId;
  products: [
    {
      product: Types.ObjectId;
      quantity: number;
    },
  ];
  status: Status;
}

export type TOrderModel = Model<Order>;

export type TOrderDocument = Document<Types.ObjectId, any, Order>;

const orderSchema = new Schema<Order, TOrderModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.Pending,
    required: true,
  },
});

export const OrderModel = model<Order, TOrderModel>("Order", orderSchema);
