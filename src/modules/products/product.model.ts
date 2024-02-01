import { Document, Model, Schema, Types, model } from "mongoose";

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  isAvailable: boolean;
}

export type TProductModel = Model<Product>;

export type TProductDocument = Document<Types.ObjectId, any, Product> & Product;

const productSchema = new Schema<Product, TProductModel>(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ProductModel = model<Product, TProductModel>(
  "Product",
  productSchema,
);
