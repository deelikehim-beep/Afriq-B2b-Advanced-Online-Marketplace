import { jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const appState = pgTable("app_state", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
}, table => ({
  userUnique: uniqueIndex("app_state_user_unique").on(table.userId),
}));