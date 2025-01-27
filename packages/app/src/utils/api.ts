import { hc } from "hono/client";
import type { AppType } from "../../netlify/edge-functions";

export const client = hc<AppType>("http://localhost:3000/");
