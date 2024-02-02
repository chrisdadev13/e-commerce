import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

const auth = async (ctx: Context, next: Next) => {
  if (!ctx.get("user")) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  await next();
};

export default auth;
