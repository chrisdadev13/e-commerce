import { COOKIE_OPTIONS } from "../../config/constants";

import { Hono } from "hono";
import { setCookie } from "hono/cookie";

import { TCreationSchema, ZCreationSchema } from "./user.schema";

import userService from "./user.service";
import validator from "../../utils/validator";

const user = new Hono();

user.post("/", validator("json", ZCreationSchema), async (ctx) => {
  const json: TCreationSchema = await ctx.req.json();

  const { token, user } = await userService.register(json);

  setCookie(ctx, "accessToken", token, COOKIE_OPTIONS);

  return ctx.json({
    data: user,
  });
});

export default user;
