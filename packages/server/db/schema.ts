import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { applicationStatusEnum } from '@internal/shared'
import { randomUUID } from 'node:crypto'
import { type Application } from '@internal/shared'
import type { Expect, Equal } from 'type-testing'
import type { ConditionalExcept, ValueOf, SetOptional } from 'type-fest'

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

type NullableOnly<T> = ConditionalExcept<T, Exclude<ValueOf<T>, null>>
// nullable keys are set to optional so that zod schemas can use .nullish
type OptionalNullableKeys<T> = SetOptional<T, keyof NullableOnly<T>>

// TESTS
type __shoudldMatch = Expect<
  Equal<Application, OptionalNullableKeys<typeof applications.$inferSelect>>
>
