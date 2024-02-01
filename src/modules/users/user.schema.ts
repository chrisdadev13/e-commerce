import { z } from "zod";
import { Role } from "./user.model";

export const ZCreationSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(250),
  role: z.nativeEnum(Role),
});

export type TCreationSchema = z.infer<typeof ZCreationSchema>;
