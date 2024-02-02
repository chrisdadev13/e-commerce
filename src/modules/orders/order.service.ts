import { HTTPException } from "hono/http-exception";
import { Order, OrderModel } from "./order.model";
import {
  TUpdateSchema,
  type TCreationSchema,
  TStatusSchema,
} from "./order.schema";
import { type TGetByIdSchema, type TListSchema } from "../../utils/commons";
import { ProductModel } from "../products/product.model";
import { FilterQuery, Types } from "mongoose";
import { Status } from "./order.model";

const create = async ({
  userId,
  product,
  quantity,
  status = "Processing",
}: TCreationSchema & { userId: Types.ObjectId }) => {
  const productInfo = await ProductModel.findOne({
    _id: product,
  }).select("_id stock isAvailable");

  if (!productInfo)
    throw new HTTPException(404, {
      message: "The provided product id doesn't exists",
    });

  if (!productInfo.isAvailable)
    throw new HTTPException(400, {
      message: "Requested product is not avaiable at this moment",
    });

  if (quantity > productInfo.stock)
    throw new HTTPException(400, {
      message: "Requested quantity exceeds available stock",
    });

  const order = new OrderModel({
    user: userId,
    products: [
      {
        product,
        quantity,
      },
    ],
    status,
  });

  productInfo.stock -= quantity;

  await Promise.all([order.save(), productInfo.save()]);

  return {
    id: order._id,
  };
};

const listByUser = async (
  userId: TGetByIdSchema,
  { page = 1, pageSize = 10 }: TListSchema,
) => {
  const skip = (page - 1) * pageSize;

  const query: FilterQuery<Order> = { user: userId };
  const [total, orders] = await Promise.allSettled([
    OrderModel.countDocuments(query),
    OrderModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: "products.product",
        select: "name description price",
      })
      .select("-products._id -__v")
      .lean<Order>(),
  ]);

  if (total.status === "rejected" || orders.status === "rejected")
    throw new HTTPException(500, {
      message: "Something bad happened retrieving the data",
    });

  return {
    currentPage: page,
    totalPages: Math.ceil(total.value / pageSize),
    total: total.value,
    orders: orders.value,
  };
};

const getOne = async (userId: TGetByIdSchema, id: TGetByIdSchema) => {
  const order = await OrderModel.findOne({ _id: id, user: userId }).populate({
    path: "products.product",
    select: "name description price",
  });
  if (!order) throw new HTTPException(404, { message: "Order not found" });

  return {
    order,
  };
};

const updateQuantity = async (
  userId: TGetByIdSchema,
  id: TGetByIdSchema,
  { product, quantity }: TUpdateSchema,
) => {
  const order = await OrderModel.findOne({
    _id: id,
    user: userId,
  });
  if (!order) throw new HTTPException(404, { message: "Order not found" });

  const selectedProduct = await ProductModel.findById(product);

  if (!selectedProduct)
    throw new HTTPException(404, { message: "Product not found" });

  if (quantity > selectedProduct.stock || !selectedProduct.isAvailable) {
    throw new HTTPException(200, {
      message: "Product is so good that is not available anymore 🙂",
    });
  }

  const newOrderProducts = order.products.map((orderProduct) => {
    if (product.equals(orderProduct.product)) {
      if (orderProduct.quantity > quantity) {
        const change = orderProduct.quantity - quantity;
        selectedProduct.stock += change;

        return {
          product,
          quantity,
        };
      }

      const change = quantity - orderProduct.quantity;
      selectedProduct.stock -= change;
      return {
        product,
        quantity,
      };
    }
    return orderProduct;
  });

  order.products = newOrderProducts as [
    { product: Types.ObjectId; quantity: number },
  ];

  await Promise.all([order.save(), selectedProduct.save()]);

  return {
    newQuantity: quantity,
    status: "Updated",
  };
};

const updateStatus = async (id: TGetByIdSchema, status: TStatusSchema) => {
  const order = await OrderModel.findOne({
    _id: id,
  });
  if (!order) throw new HTTPException(404, { message: "Order not found" });

  order.status = Status[status];

  await order.save();

  return {
    status,
  };
};

const deleteOne = async (userId: TGetByIdSchema, id: TGetByIdSchema) => {
  const doesExist = await OrderModel.exists({
    _id: id,
    user: userId,
  });

  if (!doesExist)
    throw new HTTPException(404, {
      message: "The Order with the provided ID doesn't exists",
    });

  await ProductModel.deleteOne({ _id: id });

  return {
    status: "Deleted ⛔️",
  };
};
const orderService = {
  create,
  listByUser,
  getOne,
  updateQuantity,
  updateStatus,
  deleteOne,
};

export default orderService;
