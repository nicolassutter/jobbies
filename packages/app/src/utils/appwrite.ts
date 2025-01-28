import { z } from "zod";
import { capitalize } from "~/lib/utils";

export const applicationStatusEnum = z.enum([
  "applied",
  "interviewing",
  "offered",
  "rejected",
  "accepted",
  "declined",
  "ghosted",
  "archived",
]);
export type ApplicationStatus = z.infer<typeof applicationStatusEnum>;

export const statuses = applicationStatusEnum._def.values
  .toSorted((a, b) => a.localeCompare(b))
  .map((status) => capitalize(status));

export const ApplicationSchema = z.object({
  jobTitle: z.string().min(1),
  notes: z.string().optional(),
  applicationStatus: applicationStatusEnum.optional(),
  url: z
    // can be an empty string (if the user wants to empty the field) but it will be transformed to null to empty the field in the database
    // The database won't store empty strings, only null values because it expects a valid url
    // first validate that it is a string -> transform the value -> make sure that is a valid url if it's a string
    .string()
    .optional()
    .transform((v) => (v === "" ? null : v))
    .pipe(z.string().url().optional().nullable()),
});
export type Application = z.infer<typeof ApplicationSchema>;
