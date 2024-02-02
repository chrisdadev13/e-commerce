import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "hono";
import { ZodType, ZodTypeDef, z } from "zod";
import { HTTPException } from "hono/http-exception";
import { Types } from "mongoose";

export const ZodObjectId = z
  .instanceof(Types.ObjectId)
  .or(z.string().transform((val) => Types.ObjectId.createFromHexString(val)));

export default function (
  target: keyof ValidationTargets,
  schema: ZodType<any, ZodTypeDef, any>,
) {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      // Where is the error
      const { path } = result.error.errors[0];

      // What's the cause of the error
      const { message } = result.error.errors[0];

      const errorMessageFormatted = `${path[0]} field: ${message}`;
      throw new HTTPException(400, {
        message: errorMessageFormatted,
      });
    }
  });
}
