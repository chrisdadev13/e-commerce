import { Hono } from "hono";
import { UserModel } from "../modules/users/user.model";
import { getCookie } from "hono/cookie";
import jwt from "../utils/jwt";

const validateToken = new Hono();

validateToken.use(async (ctx, next) => {
  const doesExist = ctx.get("user");
  if (doesExist) {
    return await next();
  }

  const accessToken = getCookie(ctx, "accessToken");

  if (!accessToken) {
    return await next();
  }
  const verifyToken = await jwt().verifyToken(accessToken);

  if (!verifyToken) {
    return await next();
  }

  const user = await UserModel.findById(verifyToken);

  if (user) {
    ctx.set("user", user);
    return await next();
  }

  await next();
});

export default validateToken;
