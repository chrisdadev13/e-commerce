import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

const swagger = new OpenAPIHono();

swagger.openapi(
  createRoute({
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
  }),
  (c) => {
    return c.json({
      message: "hello",
    });
  },
);

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
