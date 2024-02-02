import { COOKIE_OPTIONS } from "../../config/constants";

import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";

import {
  type TLoginSchema,
  type TCreationSchema,
  ZCreationSchema,
  ZLoginSchema,
} from "./user.schema";
import { Role } from "./user.model";
import { ZListSchema } from "../../utils/commons";

import userService from "./user.service";
import validator from "../../utils/validator";
import auth from "../../middlewares/auth";
import rbac from "../../middlewares/rbac";
import orderService from "../orders/order.service";

const user = new Hono();

user.post("/", validator("json", ZCreationSchema), async (ctx) => {
  const body: TCreationSchema = await ctx.req.json();

  const { token, user } = await userService.register(body);

  setCookie(ctx, "accessToken", token, COOKIE_OPTIONS);

  return ctx.json({
    token,
    data: user,
  });
});

user.post("/login", validator("json", ZLoginSchema), async (ctx) => {
  const body: TLoginSchema = ctx.req.valid("json");

  const { token, user } = await userService.login(body);

  setCookie(ctx, "accessToken", token, COOKIE_OPTIONS);

  return ctx.json({
    token,
    data: user,
  });
});

user.post("/logout", auth, async (ctx) => {
  const { _id } = ctx.get("user");

  const { userId } = await userService.logout(_id!);

  deleteCookie(ctx, "accessToken");

  return ctx.json({
    userId,
  });
});

user.get(
  "/orders",
  auth,
  rbac(Role.Customer),
  validator("query", ZListSchema),
  async (ctx) => {
    const { _id } = ctx.get("user");
    const { page, pageSize } = ctx.req.valid("query");

    const { currentPage, totalPages, total, orders } =
      await orderService.listByUser(_id!, {
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

export default user;
