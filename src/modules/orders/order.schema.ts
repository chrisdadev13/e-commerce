import { z } from "zod";
import { ZodObjectId } from "../../utils/validator";

const Status = ["Pending", "Processing", "Shipped", "Delivered"] as const;

export const ZCreationSchema = z.object({
  user: ZodObjectId,
  product: ZodObjectId,
  quantity: z.number(),
  status: z.enum(Status),
});

export const ZUpdateSchema = z.object({
  product: ZodObjectId,
  quantity: z.number(),
});

export const ZStatusSchema = z.enum(Status);

export type TCreationSchema = z.infer<typeof ZCreationSchema>;
export type TUpdateSchema = z.infer<typeof ZUpdateSchema>;
export type TStatusSchema = z.infer<typeof ZStatusSchema>;
