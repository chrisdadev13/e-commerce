import { Hono } from "hono";

import { ZCreationSchema } from "./order.schema";
import { ZListSchema } from "../../utils/commons";
import { Role } from "../users/user.model";

import orderService from "./order.service";
import validator from "../../utils/validator";
import auth from "../../middlewares/auth";
import rbac from "../../middlewares/rbac";

const order = new Hono();

order.post(
  "/",
  auth,
  rbac(Role.Customer),
  validator("json", ZCreationSchema),
  async (ctx) => {
    const body = ctx.req.valid("json");
    const { id } = await orderService.create(body);

    return ctx.json({
      data: {
        id,
      },
    });
  },
);

order.get(
  "/",
  auth,
  rbac(Role.Customer),
  validator("query", ZListSchema),
  async (ctx) => {
    const { _id } = ctx.get("user");
    const { page, pageSize } = ctx.req.valid("query");

    const { currentPage, totalPages, total, orders } =
      await orderService.listOrdersByUser(_id!, {
        page: Number(page),
        pageSize: Number(pageSize),
      });

    return ctx.json({
      data: {
        currentPage,
        totalPages,
        total,
        orders,
      },
    });
  },
);

export default order;
