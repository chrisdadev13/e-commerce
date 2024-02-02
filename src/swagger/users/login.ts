import { createRoute, z } from "@hono/zod-openapi";
import { ZCreationSchema } from "../../modules/users/user.schema";

export const userCreation = createRoute({
  method: "post",
  path: "/users",
  request: {
    params: ZCreationSchema,
  },
  responses: {
    200: {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: z.object({
            token: z.string(),
            data: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              createdAt: z.string(),
              updatedAt: z.string(),
            }),
          }),
        },
      },
    },
    409: {
      description: "Conflict, Email address is already taken",
      content: {
        "text/plain": {
          schema: z.string(),
        },
      },
    },
  },
});
