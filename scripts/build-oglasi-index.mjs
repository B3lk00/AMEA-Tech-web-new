import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "oglasi");
const OUT_FILE = path.join(ROOT, "oglasi", "index.json");

function listAdFiles() {
  if (!fs.existsSync(SRC_DIR)) fs.mkdirSync(SRC_DIR, { recursive: true });

  return fs.readdirSync(SRC_DIR).filter((f) => {
    const lower = f.toLowerCase();
    return lower.endsWith(".json") && lower !== "index.json";
  });
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function normalizeAd(obj, filename) {
  return {
    id: obj.id ?? filename.replace(/\.json$/i, ""),
    kategorija: obj.kategorija,
    naziv: obj.naziv,
    cijena: obj.cijena ?? "",
    stanje: obj.stanje ?? "",
    opis: obj.opis ?? "",
    spec: Array.isArray(obj.spec) ? obj.spec : [],
    slike: Array.isArray(obj.slike)
      ? obj.slike.map(x => (typeof x === "string" ? x : x?.image)).filter(Boolean)
      : []
  };
}

function main() {
  const files = listAdFiles();

  const items = [];
  for (const f of files) {
    const full = path.join(SRC_DIR, f);
    try {
      const obj = readJson(full);
      if (!obj?.kategorija || !obj?.naziv) continue; // minimalna validacija
      items.push(normalizeAd(obj, f));
    } catch {
      // ako neki oglas ima los JSON, preskoci ga da deploy ne padne
    }
  }

  // najnoviji prvi (grubo): obrni redoslijed
  items.reverse();

  const out = { items };
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), "utf8");
  console.log(`Generated ${OUT_FILE} with ${items.length} ads`);
}

main();
