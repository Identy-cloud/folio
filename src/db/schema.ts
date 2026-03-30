import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  jsonb,
  index,
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

export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("folders_user_id_idx").on(table.userId),
]);

export const presentations = pgTable("presentations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  folderId: uuid("folder_id")
    .references(() => folders.id, { onDelete: "set null" }),
  title: text("title").default("Sin título").notNull(),
  slug: text("slug").unique().notNull(),
  theme: text("theme").default("editorial-blue").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  password: text("password"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("presentations_user_id_idx").on(table.userId),
]);

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
  notes: text("notes").default("").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("slides_presentation_id_idx").on(table.presentationId),
]);

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

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan").default("free").notNull(),
  billingPeriod: text("billing_period").default("monthly").notNull(),
  status: text("status").default("active").notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const presentationViews = pgTable("presentation_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  presentationId: uuid("presentation_id")
    .references(() => presentations.id, { onDelete: "cascade" })
    .notNull(),
  slideIndex: integer("slide_index"),
  duration: integer("duration"),
  viewerIp: text("viewer_ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("presentation_views_presentation_id_idx").on(table.presentationId),
]);

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  presentationId: uuid("presentation_id")
    .references(() => presentations.id, { onDelete: "cascade" })
    .notNull(),
  slideIndex: integer("slide_index").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  content: text("content").notNull(),
  resolved: boolean("resolved").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("comments_presentation_id_idx").on(table.presentationId),
]);
