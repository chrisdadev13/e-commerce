import { Hono } from "hono";

import {
  TCreationSchema,
  TGetManyByIdSchema,
  TUpdateSchema,
  ZCreationSchema,
  ZGetByIdSchema,
  ZGetManyByIdSchema,
  ZListSchema,
  ZUpdateSchema,
} from "./product.schema";
import { Types } from "mongoose";
import productService from "./product.service";
import validator from "../../utils/validator";

const product = new Hono();

product.post("/", validator("json", ZCreationSchema), async (ctx) => {
  const body: TCreationSchema = await ctx.req.json();

  const { id } = await productService.create(body);

  return ctx.json({
    data: {
      id,
    },
  });
});

product.put(
  "/:id",
  validator("param", ZGetByIdSchema),
  validator("json", ZUpdateSchema),
  async (ctx) => {
    const id = ctx.req.param("id");
    const body: TUpdateSchema = await ctx.req.json();

    const { productUpdated } = await productService.update(
      new Types.ObjectId(id),
      body,
    );

    return ctx.json({
      data: {
        id,
        productUpdated,
      },
    });
  },
);

product.delete("/:id", validator("param", ZGetByIdSchema), async (ctx) => {
  const id = ctx.req.param("id");

  const { status } = await productService.deleteOne(new Types.ObjectId(id));

  return ctx.json({
    data: {
      id,
      status,
    },
  });
});

product.delete("/many", validator("json", ZGetManyByIdSchema), async (ctx) => {
  const body: TGetManyByIdSchema = await ctx.req.json();

  const { deletedCount } = await productService.deleteMany(body);

  return ctx.json({
    data: {
      deletedCount,
    },
  });
});

product.get("/", validator("query", ZListSchema), async (ctx) => {
  const { page, pageSize } = ctx.req.query();

  const { currentPage, totalPages, total, products } =
    await productService.listAvailable({
      page: Number(page),
      pageSize: Number(pageSize),
    });

  return ctx.json({
    data: {
      currentPage,
      totalPages,
      total,
      products,
    },
  });
});

export default product;
