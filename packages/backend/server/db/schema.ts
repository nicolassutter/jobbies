import { uuid, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";
import { applicationStatusEnum } from "@internal/shared";

export * from "./auth-schema";

export const userRelations = relations(user, ({ many }) => ({
  // user has many applications but applications belong to a single user
  applications: many(applications),
}));

export const applications = pgTable("applications", {
  id: uuid().primaryKey(),
  jobTitle: varchar("job_title", { length: 255 }).notNull(),
  notes: text(),
  application_status: varchar({
    length: 255,
    enum: applicationStatusEnum._def.values,
  }),
  url: varchar({ length: 255 }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const applicationRelations = relations(applications, ({ one }) => ({
  user: one(user, {
    fields: [applications.userId],
    references: [user.id],
  }),
}));
