/* =================================================================
   fetch-images.mjs — populate images/ with REAL product photos.

   You provide the image URLs (from your own files, a free/royalty-free
   stock site, or an official press/newsroom kit you have the right to use).
   This script just downloads them into the correct folders/filenames so
   the store picks them up automatically.

   Usage:
     node tools/fetch-images.mjs --init     # create/refresh tools/image-sources.json
     node tools/fetch-images.mjs            # download every entry that has a URL

   Then make sure js/data.js has:  window.MH_IMAGE_BASE = "images/";
   (it does by default). Missing photos fall back to the vector illustration.
   ================================================================= */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAP_FILE = path.join(ROOT, "tools", "image-sources.json");

// --- read product list from js/data.js (with light browser stubs) ---
function loadProducts() {
  const code = fs.readFileSync(path.join(ROOT, "js", "data.js"), "utf8");
  const sandbox = { window: {} };
  const fn = new Function("window", "function spec(o){return o||{}}" + code + "\nreturn window.DB.SEED_PHONES;");
  return fn(sandbox.window);
}

const products = loadProducts();

// --- --init: write a template the user fills with URLs ---
if (process.argv.includes("--init")) {
  let existing = {};
  if (fs.existsSync(MAP_FILE)) existing = JSON.parse(fs.readFileSync(MAP_FILE, "utf8"));
  const map = {};
  for (const p of products) map[p.slug] = existing[p.slug] || "";
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2));
  console.log(`Wrote ${MAP_FILE} with ${products.length} entries.`);
  console.log("Open it, paste an image URL next to each product you want, then run: node tools/fetch-images.mjs");
  process.exit(0);
}

// --- download every entry that has a URL ---
if (!fs.existsSync(MAP_FILE)) {
  console.error("No tools/image-sources.json found. Run:  node tools/fetch-images.mjs --init");
  process.exit(1);
}
const map = JSON.parse(fs.readFileSync(MAP_FILE, "utf8"));
const bySlug = Object.fromEntries(products.map(p => [p.slug, p]));

let done = 0, skipped = 0, failed = 0;
for (const [slug, url] of Object.entries(map)) {
  const p = bySlug[slug];
  if (!p) { console.warn(`! unknown product slug: ${slug}`); continue; }
  if (!url || !/^https?:\/\//.test(url)) { skipped++; continue; }
  const dir = path.join(ROOT, "images", p.category);
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `${slug}.jpg`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(out, buf);
    console.log(`✓ ${p.category}/${slug}.jpg  (${(buf.length / 1024).toFixed(0)} KB)`);
    done++;
  } catch (e) {
    console.error(`✗ ${slug}: ${e.message}`);
    failed++;
  }
}
console.log(`\nDone: ${done} downloaded, ${skipped} without URL, ${failed} failed.`);
