import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, appState } from "@workspace/db";
import { getRequestUser } from "../lib/request-user";

const router = Router();

router.get("/state", async (req, res) => {
  const user = await getRequestUser(req);
  if (!user) return res.status(401).json({ message: "Authentication required." });

  const [record] = await db.select().from(appState).where(eq(appState.userId, user.id)).limit(1);
  return res.json({ user, state: record?.data ?? null });
});

router.put("/state", async (req, res) => {
  const user = await getRequestUser(req);
  if (!user) return res.status(401).json({ message: "Authentication required." });

  const data = req.body?.state;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return res.status(400).json({ message: "A state object is required." });
  }

  const now = new Date();
  const [existing] = await db.select({ id: appState.id }).from(appState).where(eq(appState.userId, user.id)).limit(1);
  if (existing) {
    await db.update(appState).set({ data, updatedAt: now }).where(eq(appState.id, existing.id));
  } else {
    await db.insert(appState).values({
      id: `state_${user.id}`,
      userId: user.id,
      data,
      createdAt: now,
      updatedAt: now,
    });
  }
  return res.json({ ok: true });
});

export default router;