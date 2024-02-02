import { z } from "zod";

const Roles = ["Admin", "Customer"] as const;

export const ZCreationSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(250),
  role: z.enum(Roles),
});

export const ZLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type TCreationSchema = z.infer<typeof ZCreationSchema>;
export type TLoginSchema = z.infer<typeof ZLoginSchema>;
