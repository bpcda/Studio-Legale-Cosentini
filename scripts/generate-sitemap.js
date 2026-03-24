import { createClient } from "@supabase/supabase-js";
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

async function generateSitemap() {
  const urls = [...STATIC_ROUTES];
  const today = new Date().toISOString().split("T")[0];

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: sentences } = await supabase
      .from("commented_sentences")
      .select("id, created_at");
    if (sentences) {
      for (const s of sentences) {
        urls.push({
          path: `/sentenze-commentate/${s.id}`,
          priority: "0.6",
          changefreq: "monthly",
          lastmod: s.created_at?.split("T")[0],
        });
      }
    }

    const { data: articles } = await supabase
      .from("articles")
      .select("id, external_url, date")
      .is("external_url", null);
    if (articles) {
      for (const a of articles) {
        urls.push({
          path: `/articoli/${a.id}`,
          priority: "0.6",
          changefreq: "monthly",
          lastmod: a.date?.split("T")[0],
        });
      }
    }
  } else {
    console.warn("Supabase credentials not found – generating sitemap with static routes only.");
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
