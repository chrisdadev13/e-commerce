import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "hono";
import { ZodType, ZodTypeDef } from "zod";
import { HTTPException } from "hono/http-exception";

export default function (
  target: keyof ValidationTargets,
  schema: ZodType<any, ZodTypeDef, any>,
) {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      throw new HTTPException(400, { message: result.error.message });
    }
  });
}
