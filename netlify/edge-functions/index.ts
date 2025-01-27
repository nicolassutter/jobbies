import { Hono } from "hono";
import { handle } from "hono/netlify";

const app = new Hono();

const applications = new Hono().get("/", (c) => {
  return c.json([]);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/applications", applications); /*.route(...)*/

export type AppType = typeof routes;

export default handle(app);
