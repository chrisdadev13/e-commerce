import { CookieOptions } from "hono/utils/cookie";
import env from "./env";

export const DB_URI =
  env.ENV === "development"
    ? env.DB_URI_DEV
    : env.ENV === "production"
      ? env.DB_URI_PROD
      : env.DB_URI_TEST;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: env.ENV === "production" ? "None" : "Lax",
  secure: env.ENV === "production",
} satisfies CookieOptions;
