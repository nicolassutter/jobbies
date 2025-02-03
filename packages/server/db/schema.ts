import {
  sqliteTable,
  type SQLiteTableWithColumns,
  text,
} from 'drizzle-orm/sqlite-core'
import { ApplicationSchema, applicationStatusEnum } from '@internal/shared'
import { randomUUID } from 'node:crypto'
import type { ConditionalExcept, ValueOf, SetOptional } from 'type-fest'
import type { z } from 'zod'

type NullableOnly<T> = ConditionalExcept<T, Exclude<ValueOf<T>, null>>
// nullable keys are set to optional so that zod schemas can use .nullish
type OptionalNullableKeys<T> = SetOptional<T, keyof NullableOnly<T>>

// drizzle-zod does not work for client-side code for security reasons, at least for now
// https://github.com/drizzle-team/drizzle-orm/issues/941

/**
 * This function makes sure that the zod schema extends the table definition.
 */
function zodDrizzleTable<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TDef extends SQLiteTableWithColumns<any>,
  TShouldMatch extends z.ZodType<OptionalNullableKeys<TDef['$inferSelect']>>,
>(tableDef: TDef, _schema: TShouldMatch) {
  return tableDef
}

export const applications = zodDrizzleTable(
  sqliteTable('applications', {
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
  }),
  ApplicationSchema,
)
