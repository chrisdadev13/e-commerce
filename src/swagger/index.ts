import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

import { userCreation } from "./users/create";
import user from "../modules/users/user.controller";

const swagger = new OpenAPIHono();

const obj = {
  method: "get",
  path: "/hello",
  responses: {
    200: {
      description: "Respond a message",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
};

swagger.openapi(createRoute(userCreation), (c) => {
  console.log(c.req.valid("param"));
  return c.json({
    message: "hello",
  });
});

swagger.get(
  "/ui",
  swaggerUI({
    url: "/swagger/doc",
  }),
);

swagger.doc("/doc", {
  info: {
    title: "E-Commerce API",
    version: "v1",
  },
  openapi: "3.1.0",
});

export default swagger;
