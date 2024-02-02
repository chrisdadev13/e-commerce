import { ZCreationSchema, ZUpdateSchema } from "./product.schema";
import {
  ZListSchema,
  ZGetManyByIdSchema,
  ZGetByIdParam,
} from "../../utils/commons";
import { Types } from "mongoose";
import { Hono } from "hono";

import productService from "./product.service";
import validator from "../../utils/validator";
import auth from "../../middlewares/auth";
import rbac from "../../middlewares/rbac";
import { Role } from "../users/user.model";

const product = new Hono();

product.get("/", validator("query", ZListSchema), async (ctx) => {
  const { page, pageSize } = ctx.req.valid("query");

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

product.get("/:id", validator("param", ZGetByIdParam), async (ctx) => {
  const { id } = ctx.req.valid("param");

  const { product } = await productService.getById(id);

  return ctx.json({
    data: {
      product,
    },
  });
});

product.post(
  "/",
  auth,
  rbac(Role.Admin),
  validator("json", ZCreationSchema),
  async (ctx) => {
    const body = ctx.req.valid("json");

    const { id } = await productService.create(body);

    return ctx.json({
      data: {
        id,
      },
    });
  },
);

product.put(
  "/:id",
  auth,
  rbac(Role.Admin),
  validator("param", ZGetByIdParam),
  validator("json", ZUpdateSchema),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const body = ctx.req.valid("json");

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

product.delete(
  "/:id",
  auth,
  rbac(Role.Admin),
  validator("param", ZGetByIdParam),
  async (ctx) => {
    const { id } = ctx.req.valid("param");

    const { status } = await productService.deleteOne(new Types.ObjectId(id));

    return ctx.json({
      data: {
        id,
        status,
      },
    });
  },
);

product.delete(
  "/many",
  auth,
  rbac(Role.Admin),
  validator("json", ZGetManyByIdSchema),
  async (ctx) => {
    const { ids } = ctx.req.valid("json");

    const { deletedCount } = await productService.deleteMany({ ids });

    return ctx.json({
      data: {
        deletedCount,
      },
    });
  },
);

export default product;
