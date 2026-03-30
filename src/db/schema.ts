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
  unique,
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

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  logoUrl: text("logo_url"),
  plan: text("plan").default("free").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("workspaces_owner_id_idx").on(table.ownerId),
]);

export const workspaceMembers = pgTable("workspace_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  unique("workspace_members_ws_user_uniq").on(table.workspaceId, table.userId),
  index("workspace_members_user_id_idx").on(table.userId),
]);

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
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "set null" }),
  title: text("title").default("Sin título").notNull(),
  slug: text("slug").unique().notNull(),
  theme: text("theme").default("editorial-blue").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  password: text("password"),
  thumbnailUrl: text("thumbnail_url"),
  customThemes: jsonb("custom_themes").default({}).notNull(),
  shareExpiresAt: timestamp("share_expires_at", { withTimezone: true }),
  shareToken: text("share_token").unique(),
  forkCount: integer("fork_count").default(0).notNull(),
  publishAt: timestamp("publish_at", { withTimezone: true }),
  recordingUrl: text("recording_url"),
  recordingTimeline: jsonb("recording_timeline"),
  recordingDuration: integer("recording_duration"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("presentations_user_id_idx").on(table.userId),
  index("presentations_publish_at_idx").on(table.publishAt),
]);

export const slides = pgTable("slides", {
  id: uuid("id").primaryKey().defaultRandom(),
  presentationId: uuid("presentation_id")
    .references(() => presentations.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
  backgroundColor: text("background_color").default("#ffffff").notNull(),
  backgroundGradient: jsonb("background_gradient"),
  backgroundImage: text("background_image"),
  transition: text("transition").default("fade").notNull(),
  transitionDuration: integer("transition_duration"),
  transitionEasing: text("transition_easing"),
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

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  presentationId: uuid("presentation_id")
    .references(() => presentations.id, { onDelete: "set null" }),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("notifications_user_id_idx").on(table.userId),
]);

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  presentationId: uuid("presentation_id")
    .references(() => presentations.id, { onDelete: "cascade" })
    .notNull(),
  reporterEmail: text("reporter_email"),
  reason: text("reason").notNull(),
  description: text("description").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("reports_presentation_id_idx").on(table.presentationId),
  index("reports_status_idx").on(table.status),
]);

export const fonts = pgTable("fonts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  family: text("family").notNull(),
  url: text("url").notNull(),
  format: text("format").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("fonts_user_id_idx").on(table.userId),
]);

export const presentationVersions = pgTable("presentation_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  presentationId: uuid("presentation_id")
    .references(() => presentations.id, { onDelete: "cascade" })
    .notNull(),
  version: integer("version").notNull(),
  snapshot: jsonb("snapshot").notNull(),
  title: text("title"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("pv_presentation_version_idx").on(table.presentationId, table.version),
]);

export const savedSlides = pgTable("saved_slides", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  category: text("category"),
  elements: jsonb("elements").default([]).notNull(),
  backgroundColor: text("background_color").default("#ffffff").notNull(),
  backgroundImage: text("background_image"),
  backgroundGradient: jsonb("background_gradient"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("saved_slides_user_id_idx").on(table.userId),
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
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("comments_presentation_id_idx").on(table.presentationId),
  index("comments_parent_id_idx").on(table.parentId),
]);
