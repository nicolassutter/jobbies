import { createAuthClient } from "better-auth/react";

export const { signIn, useSession, signOut, getSession } = createAuthClient({
  baseURL: "http://localhost:3000", // the base url of your auth server
});

export type SessionData = Awaited<
  ReturnType<typeof getSession<object>>
>["data"];
