import { defineEventHandler, toWebRequest } from "#imports";
import { auth } from "../../auth";

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event));
});
