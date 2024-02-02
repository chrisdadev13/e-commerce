import { Hono } from "hono";

import { ZGetByIdParam } from "../../utils/commons";
import { ZCreationSchema, ZStatusSchema, ZUpdateSchema } from "./order.schema";
import { Role } from "../users/user.model";

import { Types } from "mongoose";

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
  "/:id",
  auth,
  rbac(Role.Customer),
  validator("param", ZGetByIdParam),
  async (ctx) => {
    const { _id: userId } = ctx.get("user");
    const id = ctx.req.param("id");

    const { order } = await orderService.getOne(
      userId!,
      new Types.ObjectId(id),
    );

    return ctx.json({
      data: {
        order,
      },
    });
  },
);

order.put(
  "/:id/quantity",
  auth,
  rbac(Role.Customer),
  validator("param", ZGetByIdParam),
  validator("json", ZUpdateSchema),
  async (ctx) => {
    const { _id: userId } = ctx.get("user");
    const id = ctx.req.param("id");
    const body = ctx.req.valid("json");

    const { status, newQuantity } = await orderService.updateQuantity(
      userId!,
      new Types.ObjectId(id),
      body,
    );

    return ctx.json({
      data: {
        status,
        newQuantity,
      },
    });
  },
);

order.put(
  "/:id/status",
  auth,
  rbac(Role.Admin),
  validator("param", ZGetByIdParam),
  validator("query", ZStatusSchema),
  async (ctx) => {
    const id = ctx.req.param("id");
    const { status } = ctx.req.valid("query");

    const { status: newStatus } = await orderService.updateStatus(
      new Types.ObjectId(id),
      status,
    );

    return ctx.json({
      data: {
        newStatus,
      },
    });
  },
);

order.delete(
  "/:id",
  auth,
  rbac(Role.Admin),
  validator("param", ZGetByIdParam),
  async (ctx) => {
    const { _id: userId } = ctx.get("user");

    const { id } = ctx.req.valid("param");

    const { status } = await orderService.deleteOne(
      userId!,
      new Types.ObjectId(id),
    );

    return ctx.json({
      data: {
        id,
        status,
      },
    });
  },
);

export default order;
