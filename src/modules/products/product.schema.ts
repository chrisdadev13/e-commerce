import { Types } from "mongoose";
import { z } from "zod";

export const ZCreationSchema = z.object({
  name: z.string().min(1).max(35),
  description: z.string().max(150),
  price: z.number().min(1),
  stock: z.number().min(0).default(1),
  isAvailable: z.boolean().default(true),
});

export const ZGetByIdSchema = z.instanceof(Types.ObjectId);
export const ZGetManyByIdSchema = z.array(z.instanceof(Types.ObjectId));
export const ZListSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

export const ZUpdateSchema = z.object({
  name: z.string().min(1).max(35).optional(),
  description: z.string().max(150).optional(),
  price: z.number().min(1).optional(),
  stock: z.number().min(0).optional(),
  isAvailable: z.boolean().optional(),
});

export type TCreationSchema = z.infer<typeof ZCreationSchema>;
export type TGetByIdSchema = z.infer<typeof ZGetByIdSchema>;
export type TGetManyByIdSchema = z.infer<typeof ZGetManyByIdSchema>;
export type TListSchema = z.infer<typeof ZListSchema>;
export type TUpdateSchema = z.infer<typeof ZUpdateSchema>;
