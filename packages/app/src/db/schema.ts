import { uuid, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { applicationStatusEnum } from "~/utils/appwrite";

export const applicationsTable = pgTable("applications", {
  id: uuid().primaryKey(),
  job_title: varchar({ length: 255 }).notNull(),
  notes: text(),
  application_status: varchar({
    length: 255,
    enum: applicationStatusEnum._def.values,
  }),
  url: varchar({ length: 255 }),
});
