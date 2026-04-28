import { Client, Account, Databases, Storage, Functions, ID, Query, Permission, Role } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT as string;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID as string;

if (!endpoint || !projectId) {
  console.warn("Appwrite credentials not configured. Backend features will be unavailable.");
}

export const client = new Client();
if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export { ID, Query, Permission, Role };

// IDs (kept fixed in setup script — see scripts/setup-appwrite.ts)
export const DB_ID = "main";

export const COLLECTIONS = {
  team_members: "team_members",
  articles: "articles",
  commented_sentences: "commented_sentences",
  consultation_requests: "consultation_requests",
  linkedin_articles: "linkedin_articles",
} as const;

export const BUCKETS = {
  team_photos: "team-photos",
  sentences_pdfs: "sentences-pdfs",
} as const;

export const FUNCTIONS = {
  send_consultation_email: "send-consultation-email",
  send_status_email: "send-status-email",
} as const;

export const isConfigured = !!endpoint && !!projectId;

/**
 * Normalize an Appwrite document so callers can use the same field names
 * the codebase already uses (id, created_at) without touching every component.
 */
export function normalizeDoc<T extends Record<string, any>>(doc: any): T {
  if (!doc) return doc;
  return {
    ...doc,
    id: doc.$id ?? doc.id,
    created_at: doc.$createdAt ?? doc.created_at,
    updated_at: doc.$updatedAt ?? doc.updated_at,
  } as T;
}

export function normalizeDocs<T extends Record<string, any>>(docs: any[]): T[] {
  return (docs ?? []).map((d) => normalizeDoc<T>(d));
}

/**
 * Get a public file URL from a bucket (used for storage).
 * Appwrite returns a URL that proxies the file via the SDK.
 */
/**
 * Cleans a payload before sending it to Appwrite:
 *  - converts empty strings ("" or whitespace-only) to null
 *  - drops `undefined` values
 *
 * Appwrite validates the FORMAT of typed attributes (email, url, ip, enum, ...)
 * even when they are not required. An empty string is not a valid email/url,
 * so we must send `null` instead to indicate "no value".
 */
export function cleanPayload<T extends Record<string, any>>(payload: T): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;
    if (typeof value === "string") {
      const trimmed = value.trim();
      out[key] = trimmed === "" ? null : trimmed;
    } else {
      out[key] = value;
    }
  }
  return out;
}

export function getFileUrl(bucketId: string, fileId: string): string {
  // view endpoint returns the file inline (works for img/iframe)
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}
