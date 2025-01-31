import { applications } from '../../../db/schema'
import { privateProcedure, router } from '..'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db'
import { randomUUID } from 'node:crypto'
import {
  ApplicationPayloadSchema,
  type ApplicationSchema,
} from '@internal/shared'
import { TRPCError } from '@trpc/server'

export const applicationsRouter = router({
  create: privateProcedure
    .input(ApplicationPayloadSchema)
    .mutation(
      async ({ input, ctx: { user, isDemoUser, demoUserUniqueStorage } }) => {
        const inputWithUserId: typeof applications.$inferInsert = {
          ...input,
          userId: user.id,
        }

        if (isDemoUser) {
          const newApplication = {
            ...inputWithUserId,
            id: randomUUID(),
          } satisfies z.infer<typeof ApplicationSchema>

          demoUserUniqueStorage.applications.push(newApplication)
          return newApplication
        }

        return db.insert(applications).values(inputWithUserId).returning()
      },
    ),

  read: privateProcedure.query(
    async ({ ctx: { user, isDemoUser, demoUserUniqueStorage } }) => {
      if (isDemoUser) return demoUserUniqueStorage.applications

      const results = await db
        .select()
        .from(applications)
        .where(eq(applications.userId, user.id))

      return results
    },
  ),

  update: privateProcedure
    .input(
      z.object({
        applicationId: z.string(),
        applicationData: ApplicationPayloadSchema,
      }),
    )
    .mutation(
      async ({ input, ctx: { user, isDemoUser, demoUserUniqueStorage } }) => {
        const { applicationId, applicationData } = input

        if (isDemoUser) {
          const applications = demoUserUniqueStorage.applications

          const appIndex = applications.findIndex(
            (app) => app.id === applicationId,
          )

          if (appIndex === -1) throw new TRPCError({ code: 'BAD_REQUEST' })

          const newApplication = {
            ...applications[appIndex],
            ...applicationData,
          }

          // update the application in memory
          applications[appIndex] = newApplication

          return newApplication
        }

        const isUserAllowed = and(
          eq(applications.userId, user.id),
          eq(applications.id, applicationId),
        )

        // since applications.id is unique, we can only have one result
        const [updatedApp] = await db
          .update(applications)
          .set(applicationData)
          .where(isUserAllowed)
          .returning()

        return updatedApp
      },
    ),

  delete: privateProcedure
    .input(z.string())
    .mutation(
      async ({
        input: id,
        ctx: { user, isDemoUser, demoUserUniqueStorage },
      }) => {
        if (isDemoUser) {
          demoUserUniqueStorage.applications =
            demoUserUniqueStorage.applications.filter((app) => app.id !== id)
          return
        }

        const isUserAllowed = and(
          eq(applications.userId, user.id),
          eq(applications.id, id),
        )

        await db.delete(applications).where(isUserAllowed)
      },
    ),
})
