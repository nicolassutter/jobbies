import { applications } from '../../../db/schema'
import { privateProcedure, router } from '..'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db'
import { ApplicationPayloadSchema } from '@internal/shared'

export const applicationsRouter = router({
  create: privateProcedure
    .input(ApplicationPayloadSchema)
    .mutation(({ input }) => {
      const userId = ''
      const inputWithUserId: typeof applications.$inferInsert = {
        ...input,
        userId,
      }
      return db.insert(applications).values(inputWithUserId).returning()
    }),
  read: privateProcedure.query(async () => {
    const userId = ''

    const results = await db
      .select()
      .from(applications)
      .where(eq(applications.userId, userId))

    return results
  }),
  update: privateProcedure
    .input(
      z.object({
        applicationId: z.string(),
        applicationData: ApplicationPayloadSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const userId = ''

      const { applicationId, applicationData } = input

      const isUserAllowed = and(
        eq(applications.userId, userId),
        eq(applications.id, applicationId),
      )

      // since applications.id is unique, we can only have one result
      const [updatedApp] = await db
        .update(applications)
        .set(applicationData)
        .where(isUserAllowed)
        .returning()

      return updatedApp
    }),
  delete: privateProcedure.input(z.string()).mutation(async ({ input: id }) => {
    await db.delete(applications).where(eq(applications.id, id))
  }),
})
