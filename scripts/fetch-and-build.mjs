import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const CSV_COLS = [
  "section","parameter_name","parameter_description",
  "cc_msb","cc_lsb","cc_min_value","cc_max_value",
  "nrpn_msb","nrpn_lsb","nrpn_min_value","nrpn_max_value",
  "usage","notes"
];

function parseCsvCompact(text) {
  const rows = [], row = [];
  let field = "", inQ = false;
  let cur = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i+1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { cur.push(field); field = ""; }
      else if (c === '\r') {}
      else if (c === '\n') { cur.push(field); rows.push(cur); cur = []; field = ""; }
      else field += c;
    }
  }
  if (field || cur.length) { cur.push(field); rows.push(cur); }
  const filtered = rows.filter(r => !(r.length === 1 && r[0] === ""));
  if (filtered.length < 2) return [];
  const header = filtered[0].map(h => h.trim().toLowerCase());
  const idxs = CSV_COLS.map(k => header.indexOf(k));
  return filtered.slice(1).map(r => {
    const arr = idxs.map(i => i >= 0 ? (r[i] || "").trim() : "");
    let end = arr.length - 1;
    while (end > 0 && arr[end] === "") end--;
    return arr.slice(0, end + 1);
  }).filter(a => a.some(v => v));
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "midi-device-lookup-web/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "midi-device-lookup-web/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

console.log("Fetching device list from GitHub…");
const tree = await fetchJson("https://api.github.com/repos/pencilresearch/midi/git/trees/main?recursive=1");
const csvFiles = (tree.tree || []).filter(f =>
  f.type === "blob" && f.path.endsWith(".csv") &&
  !f.path.startsWith(".github/") && f.path !== "template.csv" &&
  f.path.split("/").length === 2
);

console.log(`Found ${csvFiles.length} device files. Downloading…`);

const mfrMap = {};
let done = 0;
const BATCH = 10;
for (let i = 0; i < csvFiles.length; i += BATCH) {
  await Promise.all(csvFiles.slice(i, i + BATCH).map(async file => {
    const parts = file.path.split("/");
    const mfr = parts[0];
    const dev = parts[1].replace(/\.csv$/i, "");
    try {
      const text = await fetchText(
        "https://raw.githubusercontent.com/pencilresearch/midi/main/" +
        parts.map(encodeURIComponent).join("/")
      );
      const params = parseCsvCompact(text);
      if (params.length > 0) {
        if (!mfrMap[mfr]) mfrMap[mfr] = { name: mfr, devices: [] };
        mfrMap[mfr].devices.push({ name: dev, params });
      }
    } catch (e) {
      console.warn(`  skip ${file.path}: ${e.message}`);
    }
    process.stdout.write(`\r  ${++done}/${csvFiles.length}`);
  }));
}
console.log("");

const manufacturers = Object.values(mfrMap).sort((a, b) => a.name.localeCompare(b.name));
const totalDevices = manufacturers.reduce((n, m) => n + m.devices.length, 0);
const fetched = new Date().toISOString();

console.log(`Built: ${totalDevices} devices across ${manufacturers.length} manufacturers`);

const data = { fetched, manufacturers };
const d = new Date(fetched);
const dateStr = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
const version = `v${d.getUTCFullYear()}.${String(d.getUTCMonth()+1).padStart(2,"0")}.${String(d.getUTCDate()).padStart(2,"0")}`;
const subtitle = `${totalDevices} devices · ${manufacturers.length} manufacturers · Updated ${dateStr}`;

const template = readFileSync(join(root, "src/template.html"), "utf8");
const html = template
  .replace("__DEVICE_DATA__", JSON.stringify(data))
  .replace("__SUBTITLE__", subtitle)
  .replace("__VERSION__", version);

writeFileSync(join(root, "index.html"), html, "utf8");
console.log(`Written: index.html (${(html.length / 1024 / 1024).toFixed(1)} MB)`);
