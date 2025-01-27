import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "~/trpc/context";
import { appRouter } from "~/trpc/router";

export default defineEventHandler((event) => {
  const request = toWebRequest(event);

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext,
  });
});
