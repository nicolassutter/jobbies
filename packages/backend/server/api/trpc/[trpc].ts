import { defineEventHandler, toWebRequest } from "#imports";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../trpc/routers/app.router";
import { createContext } from "../../trpc/context";

export default defineEventHandler((event) => {
  const request = toWebRequest(event);

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext,
  });
});
