import { HTTPException } from "hono/http-exception";
import { Order, OrderModel } from "./order.model";
import { type TCreationSchema } from "./order.schema";
import { type TGetByIdSchema, type TListSchema } from "../../utils/commons";
import { ProductModel } from "../products/product.model";
import { FilterQuery } from "mongoose";

const create = async ({
  user,
  product,
  quantity,
  status = "Processing",
}: TCreationSchema) => {
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
    user,
    products: [
      {
        product,
        quantity,
      },
    ],
    status,
  });

  await order.save();

  return {
    id: order._id,
  };
};

const listOrdersByUser = async (
  userId: TGetByIdSchema,
  { page = 1, pageSize = 10 }: TListSchema,
) => {
  const skip = (page - 1) * pageSize;

  const query: FilterQuery<Order> = { user: userId };
  const [total, orders] = await Promise.allSettled([
    OrderModel.countDocuments(query),
    OrderModel.find(query).skip(skip).limit(pageSize).lean<Order>(),
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

const orderService = {
  create,
  listOrdersByUser,
};

export default orderService;
