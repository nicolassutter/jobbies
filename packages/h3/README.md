# @internal/server

h3 server that runs tRPC endpoints + auth endpoints (better-auth).

In dev mode, the `listhen` package takes care of live reloading + TS support.

For production, `src/index.ts` is bundled with `tsup` to avoid any weird TS behavior on Netlify (like not resolving .ts files when importing from the @internal/shared package). In the end we should have a `netlify/functions/index.mjs` file ready to be hosted on Netlify.

## Database

- We use a self hosted postgres instance on Railway
- In development we actually use pglite which uses WASM to start a local postgres env

## Netlify

- We de not run on edge functions because `node-postgres` aka `pg` doesn't work there, we could migration to Neon or Vercel postgres in the future
