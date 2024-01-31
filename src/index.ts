import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { connectDB } from "./config/db";

import env from "./config/env";

const port = env.PORT;

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

console.log(`Server is running on port ${port}`);

connectDB();

serve({
  fetch: app.fetch,
  port,
});
