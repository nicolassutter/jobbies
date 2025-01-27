import { applications } from "~/db/schema";
import { privateProcedure, router } from "..";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db";

const applicationSchema = z
  .object({})
  .transform((v) => v as typeof applications.$inferInsert);

export const applicationsRouter = router({
  create: privateProcedure.input(applicationSchema).mutation(({ input }) => {
    const userId = "";
    const inputWithUserId = { ...input, userId };
    return db.insert(applications).values(inputWithUserId).returning();
  }),
  read: privateProcedure.query(async () => {
    const userId = "";

    const results = await db
      .select()
      .from(applications)
      .where(eq(applications.userId, userId));

    return results;
  }),
  update: privateProcedure
    .input(
      z.object({
        applicationId: z.string(),
        applicationData: applicationSchema,
      }),
    )
    .mutation(({ input }) => {
      const userId = "";

      const { applicationId, applicationData } = input;

      const isUserAllowed = and(
        eq(applications.userId, userId),
        eq(applications.id, applicationId),
      );

      return db.update(applications).set(applicationData).where(isUserAllowed);
    }),
  delete: privateProcedure.input(z.string()).mutation(async ({ input: id }) => {
    await db.delete(applications).where(eq(applications.id, id));
  }),
});
