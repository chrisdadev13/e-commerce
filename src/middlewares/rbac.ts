import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { Role } from "../modules/users/user.model";

// Role Based Access Control
export default function (role: Role) {
  return async (ctx: Context, next: Next) => {
    const user = ctx.get("user");

    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    if (user.role !== role) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    await next();
  };
}
