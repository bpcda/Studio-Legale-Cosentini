/**
 * Idempotent setup script for the Appwrite project.
 *
 * Provisions: database, collections (with attributes + indexes), buckets,
 * and applies the agreed permissions model.
 *
 * Usage:
 *   APPWRITE_ENDPOINT=https://api.cosentini.it/v1 \
 *   APPWRITE_PROJECT_ID=69ee63d10023cad5bb3a \
 *   APPWRITE_API_KEY=<server API key with databases.* + buckets.*> \
 *   bun run scripts/setup-appwrite.ts
 *
 * On Coolify: set APPWRITE_API_KEY as a secret env var. Re-running is safe — the
 * script swallows "already exists" errors.
 */

import { Client, Databases, Storage, Permission, Role, IndexType } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT!;
const projectId = process.env.APPWRITE_PROJECT_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;

if (!endpoint || !projectId || !apiKey) {
  console.error("Missing APPWRITE_ENDPOINT / APPWRITE_PROJECT_ID / APPWRITE_API_KEY");
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = "main";

const ok = async <T>(p: Promise<T>, label: string): Promise<T | null> => {
  try {
    const r = await p;
    console.log("✓", label);
    return r;
  } catch (err: any) {
    if (err?.code === 409 || /already exists/i.test(err?.message ?? "")) {
      console.log("·", label, "(already exists)");
      return null;
    }
    console.error("✗", label, "—", err?.message ?? err);
    return null;
  }
};

// Public-read everywhere; admin-only writes. consultation_requests overrides this.
const PUBLIC_READ_ADMIN_WRITE = [
  Permission.read(Role.any()),
  Permission.create(Role.label("admin")),
  Permission.update(Role.label("admin")),
  Permission.delete(Role.label("admin")),
];

// Anyone (including anonymous sessions) can create. Only admin can read/update/delete.
const CONSULTATION_PERMS = [
  Permission.create(Role.users()),
  Permission.read(Role.label("admin")),
  Permission.update(Role.label("admin")),
  Permission.delete(Role.label("admin")),
];

async function main() {
  // 1. Database
  await ok(databases.create(DB_ID, "Main"), `database '${DB_ID}'`);

  // 2. Collections + attributes + indexes
  // ---- team_members
  await ok(
    databases.createCollection(DB_ID, "team_members", "Team Members", PUBLIC_READ_ADMIN_WRITE, false),
    "collection team_members"
  );
  await ok(databases.createStringAttribute(DB_ID, "team_members", "full_name", 200, true), "team_members.full_name");
  await ok(databases.createStringAttribute(DB_ID, "team_members", "role_title", 200, false), "team_members.role_title");
  await ok(databases.createStringAttribute(DB_ID, "team_members", "short_description", 1000, false), "team_members.short_description");
  await ok(databases.createStringAttribute(DB_ID, "team_members", "long_description", 5000, false), "team_members.long_description");
  await ok(databases.createStringAttribute(DB_ID, "team_members", "email", 255, false), "team_members.email");
  await ok(databases.createStringAttribute(DB_ID, "team_members", "phone", 50, false), "team_members.phone");
  await ok(databases.createStringAttribute(DB_ID, "team_members", "photo_url", 1000, false), "team_members.photo_url");
  await ok(databases.createStringAttribute(DB_ID, "team_members", "photo_file_id", 100, false), "team_members.photo_file_id");
  await ok(databases.createIntegerAttribute(DB_ID, "team_members", "display_order", true, undefined, undefined, 0), "team_members.display_order");
  await ok(databases.createIndex(DB_ID, "team_members", "by_order", IndexType.Key, ["display_order"]), "team_members idx by_order");

  // ---- articles
  await ok(
    databases.createCollection(DB_ID, "articles", "Articles", PUBLIC_READ_ADMIN_WRITE, false),
    "collection articles"
  );
  await ok(databases.createStringAttribute(DB_ID, "articles", "title", 300, true), "articles.title");
  await ok(databases.createStringAttribute(DB_ID, "articles", "excerpt", 1000, false), "articles.excerpt");
  await ok(databases.createStringAttribute(DB_ID, "articles", "content", 1_000_000, false), "articles.content");
  await ok(databases.createStringAttribute(DB_ID, "articles", "external_url", 1000, false), "articles.external_url");
  await ok(databases.createStringAttribute(DB_ID, "articles", "tags", 100, false, undefined, true), "articles.tags");
  await ok(databases.createStringAttribute(DB_ID, "articles", "author_name", 200, false), "articles.author_name");
  await ok(databases.createStringAttribute(DB_ID, "articles", "author_team_member_id", 100, false), "articles.author_team_member_id");
  await ok(databases.createStringAttribute(DB_ID, "articles", "date", 30, true), "articles.date");
  await ok(databases.createIndex(DB_ID, "articles", "by_date", IndexType.Key, ["date"], ["DESC"]), "articles idx by_date");

  // ---- commented_sentences
  await ok(
    databases.createCollection(DB_ID, "commented_sentences", "Commented Sentences", PUBLIC_READ_ADMIN_WRITE, false),
    "collection commented_sentences"
  );
  await ok(databases.createStringAttribute(DB_ID, "commented_sentences", "title", 300, true), "commented_sentences.title");
  await ok(databases.createStringAttribute(DB_ID, "commented_sentences", "comment", 1_000_000, true), "commented_sentences.comment");
  await ok(databases.createStringAttribute(DB_ID, "commented_sentences", "tags", 100, false, undefined, true), "commented_sentences.tags");
  await ok(databases.createStringAttribute(DB_ID, "commented_sentences", "pdf_url", 1000, false), "commented_sentences.pdf_url");
  await ok(databases.createStringAttribute(DB_ID, "commented_sentences", "pdf_file_id", 100, false), "commented_sentences.pdf_file_id");
  await ok(databases.createStringAttribute(DB_ID, "commented_sentences", "author_name", 200, false), "commented_sentences.author_name");
  await ok(databases.createStringAttribute(DB_ID, "commented_sentences", "author_team_member_id", 100, false), "commented_sentences.author_team_member_id");

  // ---- consultation_requests
  await ok(
    databases.createCollection(DB_ID, "consultation_requests", "Consultation Requests", CONSULTATION_PERMS, false),
    "collection consultation_requests"
  );
  await ok(databases.createStringAttribute(DB_ID, "consultation_requests", "full_name", 200, true), "consultation_requests.full_name");
  await ok(databases.createStringAttribute(DB_ID, "consultation_requests", "email", 255, true), "consultation_requests.email");
  await ok(databases.createStringAttribute(DB_ID, "consultation_requests", "phone", 50, true), "consultation_requests.phone");
  await ok(databases.createStringAttribute(DB_ID, "consultation_requests", "service_type", 50, true), "consultation_requests.service_type");
  await ok(databases.createStringAttribute(DB_ID, "consultation_requests", "message", 5000, true), "consultation_requests.message");
  await ok(databases.createStringAttribute(DB_ID, "consultation_requests", "consultation_mode", 30, true), "consultation_requests.consultation_mode");
  await ok(databases.createEnumAttribute(DB_ID, "consultation_requests", "status", ["pending", "accepted", "completed", "rejected"], true), "consultation_requests.status");
  await ok(databases.createIndex(DB_ID, "consultation_requests", "by_status", IndexType.Key, ["status"]), "consultation_requests idx by_status");

  // ---- linkedin_articles (optional cache)
  await ok(
    databases.createCollection(DB_ID, "linkedin_articles", "LinkedIn Articles", PUBLIC_READ_ADMIN_WRITE, false),
    "collection linkedin_articles"
  );
  await ok(databases.createStringAttribute(DB_ID, "linkedin_articles", "title", 300, true), "linkedin_articles.title");
  await ok(databases.createStringAttribute(DB_ID, "linkedin_articles", "excerpt", 1000, false), "linkedin_articles.excerpt");
  await ok(databases.createStringAttribute(DB_ID, "linkedin_articles", "url", 1000, true), "linkedin_articles.url");
  await ok(databases.createStringAttribute(DB_ID, "linkedin_articles", "source", 100, false), "linkedin_articles.source");
  await ok(databases.createStringAttribute(DB_ID, "linkedin_articles", "date", 30, true), "linkedin_articles.date");
  await ok(databases.createIndex(DB_ID, "linkedin_articles", "by_date", IndexType.Key, ["date"], ["DESC"]), "linkedin_articles idx by_date");

  // 3. Buckets
  await ok(
    storage.createBucket(
      "team-photos",
      "Team Photos",
      [Permission.read(Role.any()), Permission.create(Role.label("admin")), Permission.delete(Role.label("admin"))],
      false, // fileSecurity → use bucket-wide perms by default; per-file perms override
      true,  // enabled
      10 * 1024 * 1024, // maxFileSize 10MB
      ["jpg", "jpeg", "png", "webp"]
    ),
    "bucket team-photos"
  );

  await ok(
    storage.createBucket(
      "sentences-pdfs",
      "Sentences PDFs",
      [Permission.read(Role.any()), Permission.create(Role.label("admin")), Permission.delete(Role.label("admin"))],
      false,
      true,
      50 * 1024 * 1024, // 50MB
      ["pdf"]
    ),
    "bucket sentences-pdfs"
  );

  console.log("\n✅ Setup complete.");
  console.log("Next steps:");
  console.log(" 1. Create your admin user in Appwrite console (Auth → Users → Create user, email+password).");
  console.log(" 2. Create a team called 'admin' (Teams → Create team), assign your admin user to it,");
  console.log("    and add the label 'admin' to the user (Users → click user → Labels → add 'admin').");
  console.log("    The label is what unlocks read/update/delete on consultation_requests and writes elsewhere.");
  console.log(" 3. Deploy the two functions in /functions, set RESEND_API_KEY, and configure execute access:");
  console.log("    - send-consultation-email → execute: users (anonymous sessions OK)");
  console.log("    - send-status-email       → execute: label:admin");
}

main().catch((e) => { console.error(e); process.exit(1); });
