import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";

const POSTS_DIR = resolve(process.cwd(), "content", "posts");
const BASE_URL = "https://hovanhoa.net";

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {};

  const block = match[1];
  const data = {};
  const lines = block.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.startsWith("#")) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (value === "") {
      const arr = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        i += 1;
        arr.push(lines[i].replace(/^\s*-\s+/, "").trim().replace(/^["']|["']$/g, ""));
      }
      data[key] = arr;
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return data;
}

function readLocalPosts() {
  if (!existsSync(POSTS_DIR)) return [];

  return readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.(md|mdx)$/, "");
      const raw = readFileSync(join(POSTS_DIR, file), "utf8");
      const data = parseFrontmatter(raw);
      return {
        slug,
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

async function generateSitemap() {
  const posts = readLocalPosts();

  const staticPages = [{ path: "", changefreq: "always", priority: 1.0 }];

  const dynamicPages = posts.map((post) => ({
    path: `/${post.slug}`,
    changefreq: "daily",
    priority: 0.8,
    lastmod: new Date(post.updatedAt || post.publishedAt).toISOString(),
  }));

  const allPages = [
    ...staticPages,
    ...dynamicPages.map((page) => ({
      path: page.path,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: page.lastmod || new Date().toISOString(),
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (url) => `
  <url>
    <loc>${BASE_URL}${url.path}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${url.lastmod || new Date().toISOString()}</lastmod>
  </url>`
  )
  .join("")}
</urlset>`;

  const sitemapPath = resolve(process.cwd(), "public", "sitemap.xml");
  writeFileSync(sitemapPath, sitemap, "utf8");
  console.log(`✔️ Sitemap generated at ${sitemapPath} (${posts.length} posts)`);
}

generateSitemap().catch((err) => {
  console.error(`❌ Error generating sitemap: ${err}`);
});
