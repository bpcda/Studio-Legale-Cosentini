import { Client, Databases, Query } from "node-appwrite";
import { writeFileSync } from "fs";

const BASE_URL = "https://www.cosentini.it";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/lo-studio", priority: "0.8", changefreq: "monthly" },
  { path: "/consulenza", priority: "0.8", changefreq: "monthly" },
  { path: "/sentenze-commentate", priority: "0.7", changefreq: "weekly" },
  { path: "/articoli", priority: "0.7", changefreq: "weekly" },
  { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/cookie-policy", priority: "0.3", changefreq: "yearly" },
];

const DB_ID = process.env.APPWRITE_DATABASE_ID || "main";

async function listAll(databases, collectionId, queries = []) {
  const all = [];
  let cursor;
  while (true) {
    const q = [...queries, Query.limit(100)];
    if (cursor) q.push(Query.cursorAfter(cursor));
    const res = await databases.listDocuments(DB_ID, collectionId, q);
    all.push(...res.documents);
    if (res.documents.length < 100) break;
    cursor = res.documents[res.documents.length - 1].$id;
  }
  return all;
}

async function generateSitemap() {
  const urls = [...STATIC_ROUTES];
  const today = new Date().toISOString().split("T")[0];

  const endpoint = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (endpoint && projectId && apiKey) {
    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const databases = new Databases(client);

    try {
      const sentences = await listAll(databases, "commented_sentences");
      for (const s of sentences) {
        urls.push({
          path: `/sentenze-commentate/${s.$id}`,
          priority: "0.6",
          changefreq: "monthly",
          lastmod: (s.$updatedAt || s.$createdAt)?.split("T")[0],
        });
      }

      const articles = await listAll(databases, "articles", [Query.isNull("external_url")]);
      for (const a of articles) {
        urls.push({
          path: `/articoli/${a.$id}`,
          priority: "0.6",
          changefreq: "monthly",
          lastmod: (a.date || a.$updatedAt || a.$createdAt)?.split("T")[0],
        });
      }
    } catch (err) {
      console.warn("Failed to fetch dynamic routes from Appwrite:", err.message);
    }
  } else {
    console.warn("Appwrite credentials not found – generating sitemap with static routes only.");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE_URL}${u.path}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  writeFileSync("dist/sitemap.xml", xml, "utf-8");
  console.log(`✅ Sitemap generated with ${urls.length} URLs → dist/sitemap.xml`);
}

generateSitemap().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});
