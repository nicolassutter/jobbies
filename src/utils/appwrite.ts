import {
  ID,
  Client,
  Account,
  Databases,
  Permission,
  Role,
  type Models,
  AppwriteException,
} from "appwrite";
import { z } from "zod";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6790b4db0017cb6ec7c8"); // Replace with your project ID

export const account = new Account(client);

const databases = new Databases(client);

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

export const ApplicationSchema = z.object({
  job_title: z.string().min(1),
  notes: z.string().optional(),
  application_status: applicationStatusEnum.optional(),
  url: z.string().url().optional(),
});
export type Application = z.infer<typeof ApplicationSchema>;

export interface ApplicationDocument
  extends Models.Document,
    z.infer<typeof ApplicationSchema> {}

const DATABASE_ID = "6790b6b7002105aeeb3e";
const APPLICATIONS_COLLECTION_ID = "6790bbdc00231cd12f81";

export async function createApplication(application: Application) {
  const session = await getSession();

  if (!session) {
    throw new Error("Not logged in");
  }
  const { userId } = session;

  const doc: ApplicationDocument = await databases.createDocument(
    DATABASE_ID,
    APPLICATIONS_COLLECTION_ID,
    ID.unique(),
    application,
    [
      Permission.read(Role.user(userId)), // Only this user can read
      Permission.update(Role.user(userId)), // Only this user can update
      Permission.delete(Role.user(userId)), // Only this user can delete
    ],
  );
  return doc;
}

export async function updateApplication() {}
export async function deleteApplication(id: string) {
  return await databases.deleteDocument(
    DATABASE_ID,
    APPLICATIONS_COLLECTION_ID,
    id,
  );
}

export async function getApplications() {
  const docs = await databases.listDocuments<ApplicationDocument>(
    DATABASE_ID,
    APPLICATIONS_COLLECTION_ID,
  );
  return docs;
}

export async function login(email: string, password: string) {
  return await account.createEmailPasswordSession(email, password);
}

export async function getSession() {
  try {
    return await account.getSession("current");
  } catch (error) {
    if (import.meta.env.DEV && error instanceof AppwriteException) {
      if (error.code === 401) {
        console.log("Not logged in");
      } else {
        console.log(error);
      }
    }
    return null;
  }
}

export async function getUser() {
  try {
    return await account.get();
  } catch (error) {
    console.log("user", error);

    return null;
  }
}

export async function register({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  await account.create(ID.unique(), email, password, name);
  await login(email, password);
}

export async function logout(): Promise<void> {
  await account.deleteSession("current");
  //loggedInUser.value = null;
}
