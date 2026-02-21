import { pgTable, text, integer, boolean, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const crmContactSourceEnum = pgEnum("crm_contact_source", [
  "website", "blog", "kmong", "referral", "direct", "other",
]);

export const crmContactStatusEnum = pgEnum("crm_contact_status", [
  "lead", "prospect", "customer", "churned",
]);

export const crmDealStatusEnum = pgEnum("crm_deal_status", [
  "inquiry", "quoted", "negotiating", "won", "lost",
]);

// Tables
export const crmContacts = pgTable("crm_contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  companyId: text("company_id"),
  source: crmContactSourceEnum("source").notNull().default("direct"),
  status: crmContactStatusEnum("status").notNull().default("lead"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const crmCompanies = pgTable("crm_companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry"),
  website: text("website"),
  size: text("size"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const crmDeals = pgTable("crm_deals", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  amount: integer("amount"),
  status: crmDealStatusEnum("status").notNull().default("inquiry"),
  contactId: text("contact_id").notNull(),
  expectedCloseDate: timestamp("expected_close_date", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: text("category"),
  tags: text("tags").array(),
  author: text("author").default("AI Blog"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  featuredImage: text("featured_image"),
});
