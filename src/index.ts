import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";
import { connectDB } from "./config/db";
import { Hono } from "hono";
import { TUserDocument } from "./modules/users/user.model";

import swagger from "./swagger";
import env from "./config/env";

import user from "./modules/users/user.controller";
import product from "./modules/products/product.controller";
import order from "./modules/orders/order.controller";
import validateToken from "./middlewares/validateToken";

const port = env.PORT;

declare module "hono" {
  interface ContextVariableMap {
    user: TUserDocument;
  }
}
const app = new Hono();

app.route("*", validateToken);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  console.error(err);

  return c.json({
    code: 500,
    message: "Something bad happened",
  });
});

app.route("/swagger", swagger);

app.route("/users", user);
app.route("/products", product);
app.route("/orders", order);

console.log(`Server is running on port ${port} 🚀`);

connectDB();

serve({
  fetch: app.fetch,
  port,
});
