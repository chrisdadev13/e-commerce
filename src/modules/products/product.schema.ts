import { z } from "zod";

export const ZCreationSchema = z.object({
  name: z.string().min(1).max(35),
  description: z.string().max(150),
  price: z.number().min(1),
  stock: z.number().min(0).default(1),
  isAvailable: z.boolean().default(true),
});

export const ZUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  stock: z.number().optional(),
  isAvailable: z.boolean().optional(),
});

export type TCreationSchema = z.infer<typeof ZCreationSchema>;
export type TUpdateSchema = z.infer<typeof ZUpdateSchema>;
