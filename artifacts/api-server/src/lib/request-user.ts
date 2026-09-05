import type { Request } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth";

export async function getRequestUser(request: Request) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });
  return session?.user ?? null;
}