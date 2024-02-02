import { z } from "zod";

import { ZodObjectId } from "./validator";

export const ZGetByIdSchema = ZodObjectId;
export const ZGetByIdParam = z.object({
  id: ZodObjectId,
});

export const ZGetManyByIdSchema = z.object({
  ids: z.array(ZodObjectId),
});

export const ZListSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number),
  pageSize: z.string().regex(/^\d+$/).transform(Number),
});

export type TGetByIdSchema = z.infer<typeof ZGetByIdSchema>;
export type TGetManyByIdSchema = z.infer<typeof ZGetManyByIdSchema>;
export type TListSchema = z.infer<typeof ZListSchema>;
