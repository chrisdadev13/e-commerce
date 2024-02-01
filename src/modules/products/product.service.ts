import { HTTPException } from "hono/http-exception";
import { Product, ProductModel } from "./product.model";
import {
  TCreationSchema,
  TGetByIdSchema,
  TGetManyByIdSchema,
  TListSchema,
  TUpdateSchema,
} from "./product.schema";
import { FilterQuery } from "mongoose";

const create = async (product: TCreationSchema) => {
  const newProduct = new ProductModel(product);
  await newProduct.save();

  return {
    id: newProduct._id,
  };
};

const update = async (id: TGetByIdSchema, product: TUpdateSchema) => {
  const doesExists = await ProductModel.exists({
    _id: id,
  });

  if (!doesExists)
    throw new HTTPException(404, {
      message: "The Product with the provided ID doesn't exists",
    });

  const productUpdated = await ProductModel.findByIdAndUpdate(
    id,
    product,
  ).lean<Product>();

  return {
    productUpdated,
  };
};

const deleteOne = async (id: TGetByIdSchema) => {
  const doesExists = await ProductModel.exists({
    _id: id,
  });

  if (!doesExists)
    throw new HTTPException(404, {
      message: "The Product with the provided ID doesn't exists",
    });

  await ProductModel.deleteOne({ _id: id });

  return {
    status: "Deleted ⛔️",
  };
};

const deleteMany = async ({ ids }: TGetManyByIdSchema) => {
  const productsToDelete = await ProductModel.find({ _id: { $in: ids } });

  if (productsToDelete.length !== ids.length) {
    const foundIds = productsToDelete.map((product) => product._id.toString());
    const notFoundIds = ids.filter((id) => !foundIds.includes(id.toString()));

    throw new HTTPException(404, {
      message: `The following product IDs were not found: ${notFoundIds.join(
        ", ",
      )}`,
    });
  }

  const { deletedCount } = await ProductModel.deleteMany({
    _id: { $in: ids },
  });

  return {
    deletedCount,
  };
};

const listAvailable = async ({ page = 1, pageSize = 10 }: TListSchema) => {
  const skip = (page - 1) * pageSize;

  const query: FilterQuery<Product> = { isAvailable: true, stock: { $gte: 0 } };

  const [total, products] = await Promise.allSettled([
    ProductModel.countDocuments(query),
    ProductModel.find(query).skip(skip).limit(pageSize).lean<Product>(),
  ]);

  if (total.status === "rejected" || products.status === "rejected")
    throw new HTTPException(500, {
      message: "Something bad happened retrieving the data",
    });

  return {
    currentPage: page,
    totalPages: Math.ceil(total.value / pageSize),
    total: total.value,
    products: products.value,
  };
};

const productService = {
  create,
  update,
  deleteOne,
  deleteMany,
  listAvailable,
};

export default productService;
