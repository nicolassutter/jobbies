import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { applicationStatusEnum } from '@internal/shared'
import { randomUUID } from 'node:crypto'

export const applications = sqliteTable('applications', {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  jobTitle: text('job_title', { length: 255 }).notNull(),
  notes: text(),
  applicationStatus: text('application_status', {
    length: 255,
    enum: applicationStatusEnum._def.values,
  }),
  url: text({ length: 255 }),
  userId: text('user_id') // references a Pocketbase user
    .notNull(),
})
