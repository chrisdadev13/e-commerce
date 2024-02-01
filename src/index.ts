import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import { connectDB } from "./config/db";

import env from "./config/env";

const port = env.PORT;
const app = new Hono();

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({
    code: 500,
    message: "Something bad happened",
  });
});

console.log(`Server is running on port ${port} 🚀`);

connectDB();

serve({
  fetch: app.fetch,
  port,
});
