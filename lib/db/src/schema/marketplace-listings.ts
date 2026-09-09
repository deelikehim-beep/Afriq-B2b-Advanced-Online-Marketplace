import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const marketplaceListings = pgTable("marketplace_listings", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  product: jsonb("product").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});