import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../backend/server/trpc/routers/app.router";

export const trpcUrl = "http://localhost:3000/trpc";
export const trpc = createTRPCReact<AppRouter>();
