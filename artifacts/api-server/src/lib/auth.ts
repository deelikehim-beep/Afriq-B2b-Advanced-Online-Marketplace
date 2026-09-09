import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { bearer } from "better-auth/plugins/bearer";
import { db } from "@workspace/db";
import * as schema from "@workspace/db/schema";

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error("SESSION_SECRET must be set before the API server starts.");
}

export const auth = betterAuth({
  secret,
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_URL ?? (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : undefined),
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [bearer()],
  trustedOrigins: [
    "http://localhost:8081",
    "http://localhost:18115",
    ...(process.env.REPLIT_DEV_DOMAIN ? [`https://${process.env.REPLIT_DEV_DOMAIN}`] : []),
    ...(process.env.REPLIT_EXPO_DEV_DOMAIN ? [`https://${process.env.REPLIT_EXPO_DEV_DOMAIN}`] : []),
  ],
});