/**
 * Script to fetch complete Vietnam administrative divisions data from esgoo.net
 * and save as static JSON files.
 *
 * Usage: node scripts/fetch-vn-addresses.js
 *
 * Output:
 *   public/data/vn-addresses/provinces.json
 *   public/data/vn-addresses/districts/{id}.json
 *   public/data/vn-addresses/wards/{id}.json
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://esgoo.net/api-tinhthanh";
const OUT_DIR = path.join(__dirname, "../public/data/vn-addresses");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.error !== 0) throw new Error(`API error: ${json.error_text}`);
  return json.data; // array of items
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function main() {
  console.log("Fetching Vietnam address data from esgoo.net...\n");
  ensureDir(OUT_DIR);
  ensureDir(path.join(OUT_DIR, "districts"));
  ensureDir(path.join(OUT_DIR, "wards"));

  // 1. Fetch all provinces
  console.log("[1/3] Fetching provinces...");
  const provinces = await fetchJson(`${BASE_URL}/1/0.htm`);
  console.log(`  Found ${provinces.length} provinces`);

  const provinceList = provinces.map((p) => ({
    code: p.id,
    name: p.name,
    full_name: p.full_name,
    type: p.full_name.split(" ").slice(0, -1).join(" ") || p.full_name,
  }));
  saveJson(path.join(OUT_DIR, "provinces.json"), provinceList);
  console.log(`  Saved provinces.json\n`);

  // 2. Fetch all districts for each province
  console.log("[2/3] Fetching districts for each province...");
  let totalDistricts = 0;
  for (let i = 0; i < provinces.length; i++) {
    const province = provinces[i];
    process.stdout.write(`  [${i + 1}/${provinces.length}] ${province.name}... `);

    const districts = await fetchJson(`${BASE_URL}/2/${province.id}.htm`);
    totalDistricts += districts.length;
    process.stdout.write(`${districts.length} districts\n`);

    const districtList = districts.map((d) => ({
      code: d.id,
      name: d.name,
      full_name: d.full_name,
      type: d.full_name.split(" ").slice(0, -1).join(" ") || d.full_name,
      province_code: province.id,
    }));

    const provinceCode = province.id.padStart(2, "0");
    saveJson(path.join(OUT_DIR, "districts", `${provinceCode}.json`), districtList);

    // 3. Fetch all wards for each district
    for (let j = 0; j < districts.length; j++) {
      const district = districts[j];
      await delay(100); // be respectful

      let wards = [];
      try {
        wards = await fetchJson(`${BASE_URL}/3/${district.id}.htm`);
      } catch (e) {
        console.log(`    Warning: failed to fetch wards for district ${district.id}: ${e.message}`);
      }

      if (wards.length > 0) {
        const districtCode = district.id.padStart(3, "0");
        const wardList = wards.map((w) => ({
          code: w.id,
          name: w.name,
          full_name: w.full_name,
          type: w.full_name.split(" ").slice(0, -1).join(" ") || w.full_name,
          district_code: district.id,
        }));
        saveJson(path.join(OUT_DIR, "wards", `${districtCode}.json`), wardList);
      }
    }

    await delay(100); // be respectful between provinces
  }

  console.log(`\n  Total: ${totalDistricts} districts\n`);

  // Summary
  const provincesCount = provinceList.length;
  const districtsCount = fs.readdirSync(path.join(OUT_DIR, "districts")).length;
  const wardsCount = fs.readdirSync(path.join(OUT_DIR, "wards")).length;

  console.log("=== SUMMARY ===");
  console.log(`Provinces: ${provincesCount}`);
  console.log(`District files: ${districtsCount}`);
  console.log(`Ward files: ${wardsCount}`);
  console.log(`Output: ${OUT_DIR}`);

  // Count total wards
  let totalWards = 0;
  fs.readdirSync(path.join(OUT_DIR, "wards")).forEach((file) => {
    const wards = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "wards", file), "utf-8"));
    totalWards += wards.length;
  });
  console.log(`Total wards: ${totalWards}`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
