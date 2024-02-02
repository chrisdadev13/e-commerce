import "dotenv/config";
import { z } from "zod";

const ZEnvSchema = z.object({
  ENV: z
    .union([
      z.literal("development"),
      z.literal("production"),
      z.literal("testing"),
    ])
    .default("development"),
  PORT: z.preprocess((val) => Number(val), z.number().min(1000)),
  DB_URI_PROD: z.string().url(),
  DB_URI_DEV: z.string().url(),
  DB_URI_TEST: z.string().url(),
  SECRET_KEY: z.string(),
});

const env = ZEnvSchema.parse(process.env);

export type Environment = z.infer<typeof ZEnvSchema>;

export default env;
