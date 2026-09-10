import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db, marketplaceListings } from "@workspace/db";
import { getRequestUser } from "../lib/request-user";

const router = Router();

router.get("/marketplace/listings", async (_req, res) => {
  const rows = await db
    .select({ product: marketplaceListings.product })
    .from(marketplaceListings)
    .orderBy(desc(marketplaceListings.createdAt));

  const listings = rows
    .map(row => row.product)
    .filter(product => product.status !== "closed");

  return res.json({ listings });
});

router.get("/marketplace/my-listings", async (req, res) => {
  const user = await getRequestUser(req);
  if (!user) return res.status(401).json({ message: "Authentication required." });

  const rows = await db
    .select({ product: marketplaceListings.product })
    .from(marketplaceListings)
    .where(eq(marketplaceListings.ownerId, user.id))
    .orderBy(desc(marketplaceListings.updatedAt));

  return res.json({ listings: rows.map(row => row.product) });
});

router.post("/marketplace/listings", async (req, res) => {
  const user = await getRequestUser(req);
  if (!user) return res.status(401).json({ message: "Authentication required." });

  const product = req.body?.product;
  if (!product || typeof product !== "object" || Array.isArray(product)) {
    return res.status(400).json({ message: "A product listing is required." });
  }

  const id = String(product.id ?? "");
  if (!id || !String(product.name ?? "").trim() || !String(product.category ?? "").trim()) {
    return res.status(400).json({ message: "Product id, name and category are required." });
  }

  const now = new Date();
  const existing = await db
    .select({ id: marketplaceListings.id, ownerId: marketplaceListings.ownerId })
    .from(marketplaceListings)
    .where(eq(marketplaceListings.id, id))
    .limit(1);

  if (existing[0] && existing[0].ownerId !== user.id) {
    return res.status(409).json({ message: "This listing id is already in use." });
  }

  if (existing[0]) {
    const activeProduct = { ...product, status: "active" };
    await db.update(marketplaceListings)
      .set({ product: activeProduct, updatedAt: now })
      .where(eq(marketplaceListings.id, id));
  } else {
    const activeProduct = { ...product, status: "active" };
    await db.insert(marketplaceListings).values({
      id,
      ownerId: user.id,
      product: activeProduct,
      createdAt: now,
      updatedAt: now,
    });
  }

  return res.status(existing[0] ? 200 : 201).json({ ok: true, product: { ...product, status: "active" } });
});

router.patch("/marketplace/listings/:id", async (req, res) => {
  const user = await getRequestUser(req);
  if (!user) return res.status(401).json({ message: "Authentication required." });

  const id = String(req.params.id ?? "");
  const [existing] = await db
    .select({ id: marketplaceListings.id, ownerId: marketplaceListings.ownerId, product: marketplaceListings.product })
    .from(marketplaceListings)
    .where(eq(marketplaceListings.id, id))
    .limit(1);

  if (!existing) return res.status(404).json({ message: "Listing not found." });
  if (existing.ownerId !== user.id) return res.status(403).json({ message: "You can only manage your own listings." });

  const requestedProduct = req.body?.product;
  const requestedStatus = req.body?.status;
  if (requestedStatus !== undefined && requestedStatus !== "active" && requestedStatus !== "closed") {
    return res.status(400).json({ message: "Listing status must be active or closed." });
  }
  if (requestedProduct !== undefined && (!requestedProduct || typeof requestedProduct !== "object" || Array.isArray(requestedProduct))) {
    return res.status(400).json({ message: "A valid product listing is required." });
  }

  const product = {
    ...existing.product,
    ...(requestedProduct ?? {}),
    id,
    status: requestedStatus ?? existing.product.status ?? "active",
  };
  const now = new Date();
  await db.update(marketplaceListings)
    .set({ product, updatedAt: now })
    .where(eq(marketplaceListings.id, id));

  return res.json({ ok: true, product });
});

export default router;