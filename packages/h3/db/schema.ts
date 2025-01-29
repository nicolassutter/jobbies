import { uuid, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { applicationStatusEnum } from '@internal/shared'

export const applications = pgTable('applications', {
  id: uuid().primaryKey().defaultRandom(),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  notes: text(),
  applicationStatus: varchar('application_status', {
    length: 255,
    enum: applicationStatusEnum._def.values,
  }),
  url: varchar({ length: 255 }),
  userId: text('user_id').notNull(),
  //.references(() => user.id), // references a Pocketbase user
})
