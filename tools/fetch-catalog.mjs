// Kataloq datasını (ölkə + regional paketlər) saytın statik JSON-larına çevirir:
//   node tools/fetch-catalog.mjs
// Mənbə: tətbiqin də oxuduğu ictimai CDN (Supabase Storage `catalog/v2/all.json`) və
// regional paketlərin ölkə siyahısı üçün tətbiqin ictimai `get-package-coverage` funksiyası.
// ANON açarı repo-ya YAZILMIR: SUPABASE_ANON_KEY env və ya tətbiq mənbəyindən oxunur.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://ueumhkcekbaiodtjudxg.supabase.co';
const REGIONS = ['EUR', 'ASI', 'NOR', 'MID', 'GUL', 'CAR', 'BAL', 'GLO'];

// ANON açarı yoxdursa (məs. GitHub Actions) regionların ölkə siyahısı əvvəlki data/r/*.json-dan götürülür
// (regional paketlərin əhatəsi nadir dəyişir; paketlər və qiymətlər isə hər dəfə təzədən çəkilir).
function anonKey() {
  if (process.env.SUPABASE_ANON_KEY) return process.env.SUPABASE_ANON_KEY;
  const p = process.env.APP_SUPABASE_TS || '/Users/azer/Desktop/Simvela/simvela-app/src/core/supabase.ts';
  try {
    const m = fs.readFileSync(p, 'utf8').match(/SUPABASE_ANON_KEY\s*=\s*'([^']+)'/);
    return m ? m[1] : null;
  } catch { return null; }
}
function previousCoverage(code) {
  try {
    const prev = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'r', `${code}.json`), 'utf8'));
    return Object.fromEntries(prev.groups.map((g) => [g.id, g.countries]));
  } catch { return {}; }
}

const all = await (await fetch(`${BASE}/storage/v1/object/public/catalog/v2/all.json`)).json();
// 6-cı sahə: 1 = başqa ölkələri də əhatə edən (regional) paket, ölkə səhifəsində göstərilən; 0 = yalnız bu ölkə
const row = (p, code) => [p.name, p.dataGb, p.durationDays, p.priceUsd, p.speed, p.locationCount > 1 && code ? 1 : 0];
const sortPlans = (a, b) => a[2] - b[2] || a[1] - b[1] || a[3] - b[3];

const prevCov = Object.fromEntries(REGIONS.map((r) => [r, previousCoverage(r)]));
const out = path.join(ROOT, 'data');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'p'), { recursive: true });
fs.mkdirSync(path.join(out, 'r'), { recursive: true });

const countries = [];
for (const [code, pkgs] of Object.entries(all.loc)) {
  if (code.length !== 2 || !pkgs.length) continue;
  const rows = pkgs.map((p) => row(p, code)).sort((a, b) => a[5] - b[5] || sortPlans(a, b));
  fs.writeFileSync(path.join(out, 'p', `${code}.json`), JSON.stringify(rows));
  countries.push([code, Math.min(...rows.map((r) => r[3])), rows.length]);
}
countries.sort((a, b) => a[0].localeCompare(b[0]));

const key = anonKey();
const regions = [];
for (const code of REGIONS) {
  const pkgs = all.loc[code] ?? [];
  if (!pkgs.length) continue;
  const byLoc = new Map();
  for (const p of pkgs) {
    if (!byLoc.has(p.locationCode)) byLoc.set(p.locationCode, { sample: p.packageCode, plans: [] });
    byLoc.get(p.locationCode).plans.push(row(p, null));
  }
  const groups = [];
  for (const [id, g] of byLoc) {
    let list = [];
    try {
      if (!key) throw new Error('açar yoxdur');
      const r = await fetch(`${BASE}/functions/v1/get-package-coverage`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, apikey: key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationCode: code, packageCode: g.sample }),
      });
      list = (await r.json()).locationList ?? [];
    } catch (e) { console.warn('coverage alınmadı, əvvəlkindən götürülür', code, id, e.message); }
    if (!list.length) list = prevCov[code]?.[id] ?? [];
    g.plans.sort(sortPlans);
    groups.push({ id, countries: list.sort(), plans: g.plans, min: Math.min(...g.plans.map((r) => r[3])) });
  }
  groups.sort((a, b) => b.countries.length - a.countries.length);
  fs.writeFileSync(path.join(out, 'r', `${code}.json`), JSON.stringify({ groups }));
  regions.push([code, Math.min(...groups.map((g) => g.min)), pkgs.length, groups.map((g) => g.countries.length)]);
}

// Sanity: pozulmuş/boş kataloq saytı əzməsin — şübhəli olarsa dayan (data/ əvvəlki halında qalmır, ona görə build-dən əvvəl yoxla)
if (countries.length < 150 || regions.length < 6 || regions.some((r) => !r[3].every((n) => n > 0))) {
  console.error('Kataloq şübhəlidir:', countries.length, 'ölkə,', regions.length, 'region. Dayandırıldı.');
  process.exit(1);
}
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify({ countries, regions }));
const size = (d) => fs.readdirSync(d).reduce((s, f) => s + fs.statSync(path.join(d, f)).size, 0);
console.log('ölkə', countries.length, '| region', regions.length, '| p KB', Math.round(size(path.join(out, 'p')) / 1024), '| r KB', Math.round(size(path.join(out, 'r')) / 1024));
