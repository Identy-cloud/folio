import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  plan: text("plan").default("free").notNull(),
  storageUsed: bigint("storage_used", { mode: "number" }).default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const presentations = pgTable("presentations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").default("Sin título").notNull(),
  slug: text("slug").unique().notNull(),
  theme: text("theme").default("editorial-blue").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const slides = pgTable("slides", {
  id: uuid("id").primaryKey().defaultRandom(),
  presentationId: uuid("presentation_id")
    .references(() => presentations.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
  backgroundColor: text("background_color").default("#ffffff").notNull(),
  backgroundImage: text("background_image"),
  transition: text("transition").default("fade").notNull(),
  elements: jsonb("elements").default([]).notNull(),
  mobileElements: jsonb("mobile_elements"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const collaborators = pgTable("collaborators", {
  id: uuid("id").primaryKey().defaultRandom(),
  presentationId: uuid("presentation_id")
    .references(() => presentations.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
