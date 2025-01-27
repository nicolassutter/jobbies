import { privateProcedure, router } from "..";

export const applicationsRouter = router({
  create: privateProcedure.mutation(() => {}),
  read: privateProcedure.query(() => {}),
  update: privateProcedure.mutation(() => {}),
  delete: privateProcedure.mutation(() => {}),
});
