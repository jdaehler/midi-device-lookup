import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const API_URL = "https://api.midi.guide/v4/dump/";
const VERSION = "1.0.19";

function toCompact(dump) {
  const manufacturers = [];
  for (const mfr of Object.values(dump.manufacturers || {})) {
    const devices = [];
    for (const dev of Object.values(mfr.devices || {})) {
      const params = [];
      for (const [section, sectionParams] of Object.entries(dev.ccs || {})) {
        for (const p of sectionParams) {
          const arr = [
            section,
            p.parameter_name || "",
            p.parameter_description || "",
            p.cc_msb  != null ? String(p.cc_msb)  : "",
            p.cc_lsb  != null ? String(p.cc_lsb)  : "",
            p.cc_min_value  != null ? String(p.cc_min_value)  : "",
            p.cc_max_value  != null ? String(p.cc_max_value)  : "",
            p.nrpn_msb != null ? String(p.nrpn_msb) : "",
            p.nrpn_lsb != null ? String(p.nrpn_lsb) : "",
            p.nrpn_min_value != null ? String(p.nrpn_min_value) : "",
            p.nrpn_max_value != null ? String(p.nrpn_max_value) : "",
            p.usage  || "",
            p.notes  || "",
          ];
          let end = arr.length - 1;
          while (end > 0 && arr[end] === "") end--;
          params.push(arr.slice(0, end + 1));
        }
      }
      if (params.length > 0) {
        devices.push({ name: dev.metadata.device, params });
      }
    }
    if (devices.length > 0) {
      manufacturers.push({ name: mfr.name, devices });
    }
  }
  manufacturers.sort((a, b) => a.name.localeCompare(b.name));
  return manufacturers;
}

console.log("Fetching from midi.guide API…");
const res = await fetch(API_URL, { headers: { "User-Agent": "midi-device-lookup-web/1.0" } });
if (!res.ok) throw new Error(`HTTP ${res.status}: ${API_URL}`);
const dump = await res.json();

const manufacturers = toCompact(dump);
const totalDevices = manufacturers.reduce((n, m) => n + m.devices.length, 0);
const fetched = new Date().toISOString();

console.log(`Built: ${totalDevices} devices across ${manufacturers.length} manufacturers`);

const data = { fetched, manufacturers };
const d = new Date(fetched);
const dateStr = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
const version = `v${VERSION}`;
const subtitle = `${totalDevices} devices · ${manufacturers.length} manufacturers · Updated ${dateStr}`;

const template = readFileSync(join(root, "src/template.html"), "utf8");
const html = template
  .replace("__DEVICE_DATA__", JSON.stringify(data))
  .replace("__SUBTITLE__", subtitle)
  .replaceAll("__VERSION__", version);

writeFileSync(join(root, "index.html"), html, "utf8");
console.log(`Written: index.html (${(html.length / 1024 / 1024).toFixed(1)} MB)`);
