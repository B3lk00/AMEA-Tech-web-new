import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OGLASI_DIR = path.join(ROOT, "oglasi");
const OUT_DIR = path.join(ROOT, "oglasi");
const OUT_FILE = path.join(OUT_DIR, "index.json");

function readJsonSafe(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function isJsonFile(name) {
  return name.toLowerCase().endsWith(".json") && name.toLowerCase() !== "index.json";
}

function main() {
  if (!fs.existsSync(OGLASI_DIR)) fs.mkdirSync(OGLASI_DIR, { recursive: true });

  const files = fs.readdirSync(OGLASI_DIR).filter(isJsonFile);

  const items = [];
  for (const f of files) {
    const full = path.join(OGLASI_DIR, f);
    try {
      const obj = readJsonSafe(full);
      // Minimal validation
      if (!obj || !obj.kategorija || !obj.naziv) continue;

      items.push({
        id: obj.id ?? path.basename(f, ".json"),
        kategorija: obj.kategorija,
        naziv: obj.naziv,
        cijena: obj.cijena ?? "",
        stanje: obj.stanje ?? "",
        opis: obj.opis ?? "",
        spec: Array.isArray(obj.spec) ? obj.spec : [],
        // Decap list widget gives [{image:"..."}] unless you customize; normalize both
        slike: Array.isArray(obj.slike)
          ? obj.slike.map(s => (typeof s === "string" ? s : s?.image)).filter(Boolean)
          : [],
        kontakt: obj.kontakt ?? {}
      });
    } catch (e) {
      // ignore bad files to not break deploy
    }
  }

  // newest first if filename has date, otherwise keep as-is
  items.reverse();

  const out = { items };
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${OUT_FILE} with ${items.length} items`);
}

main();
