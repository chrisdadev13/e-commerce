import { CookieOptions } from "hono/utils/cookie";
import env from "./env";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: env.ENV === "production" ? "None" : "Lax",
  secure: env.ENV === "production",
} satisfies CookieOptions;
