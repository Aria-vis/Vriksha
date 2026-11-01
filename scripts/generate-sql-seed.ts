import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { SEED_SPECIES } from './data/species-data.js';
import { SEED_FESTIVALS } from './data/festival-data.js';
import { SEED_DEMO_PLANTS } from './data/demo-plants-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeSql(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function escapeArray(arr: (string | number)[]): string {
  if (!arr || arr.length === 0) return "'{}'";
  const items = arr.map((x) => (typeof x === 'string' ? `"${x.replace(/"/g, '\\"')}"` : x));
  return `'{${items.join(',')}}'`;
}

function generate() {
  const lines: string[] = [];
  lines.push('-- ====================================================================');
  lines.push('-- Vriksha Database Seed Data (80 Species, Festivals, Demo Plants)');
  lines.push('-- Run directly in Supabase SQL Editor');
  lines.push('-- ====================================================================\n');

  // 1. Species
  lines.push('-- 1. SEED SPECIES TAXONOMY');
  for (const s of SEED_SPECIES) {
    lines.push(
      `INSERT INTO species (scientific_name, common_name_en, common_name_hi, plant_type, use_tags, parts_used, seasonality_flowering, seasonality_fruiting, seasonality_fresh_leaves, is_toxic, toxicity_details, is_restricted, conservation_status, harvesting_etiquette, needs_review) VALUES (${escapeSql(s.scientific_name)}, ${escapeSql(s.common_name_en)}, ${escapeSql(s.common_name_hi)}, ${escapeSql(s.plant_type)}, ${escapeArray(s.use_tags)}, ${escapeArray(s.parts_used)}, ${escapeArray(s.seasonality_flowering)}, ${escapeArray(s.seasonality_fruiting)}, ${escapeArray(s.seasonality_fresh_leaves)}, ${s.is_toxic}, ${escapeSql(s.toxicity_details)}, ${s.is_restricted}, ${escapeSql(s.conservation_status)}, ${escapeSql(s.harvesting_etiquette)}, ${s.needs_review}) ON CONFLICT (scientific_name) DO NOTHING;`
    );

    for (const ln of s.local_names) {
      lines.push(
        `INSERT INTO species_local_names (species_id, language_code, local_name, transliteration) SELECT id, ${escapeSql(ln.language_code)}, ${escapeSql(ln.local_name)}, ${escapeSql(ln.transliteration || null)} FROM species WHERE scientific_name = ${escapeSql(s.scientific_name)} ON CONFLICT (species_id, language_code, local_name) DO NOTHING;`
      );
    }
  }

  // 2. Festivals & Checklist
  lines.push('\n-- 2. SEED FESTIVALS & RITUAL CHECKLISTS');
  for (const f of SEED_FESTIVALS) {
    lines.push(
      `INSERT INTO festivals (slug, name_en, name_hi, description_en, description_hi, typical_month, lunar_tithi_desc, next_observed_date, region, needs_local_review) VALUES (${escapeSql(f.slug)}, ${escapeSql(f.name_en)}, ${escapeSql(f.name_hi)}, ${escapeSql(f.description_en)}, ${escapeSql(f.description_hi)}, ${f.typical_month || 'NULL'}, ${escapeSql(f.lunar_tithi_desc)}, ${escapeSql(f.next_observed_date)}, ${escapeSql(f.region)}, ${f.needs_local_review}) ON CONFLICT (slug) DO NOTHING;`
    );

    for (const item of f.checklist) {
      lines.push(
        `INSERT INTO festival_plants (festival_id, species_id, purpose, part_needed, is_essential, needs_local_review) SELECT f.id, s.id, ${escapeSql(item.purpose)}, ${escapeSql(item.part_needed)}, ${item.is_essential}, false FROM festivals f, species s WHERE f.slug = ${escapeSql(f.slug)} AND s.scientific_name = ${escapeSql(item.species_scientific_name)} ON CONFLICT DO NOTHING;`
      );
    }
  }

  // 3. Demo Plants
  lines.push('\n-- 3. SEED PHYSICAL DEMO PLANTS ON GROUND');
  for (const p of SEED_DEMO_PLANTS) {
    lines.push(
      `INSERT INTO plants (species_id, location, fuzzed_location, address_hint, land_type, private_owner_consent, notes, source, attribution, license, status, is_sacred_heritage, heritage_story) SELECT id, ST_SetSRID(ST_MakePoint(${p.lng}, ${p.lat}), 4326)::geography, ST_SetSRID(ST_MakePoint(${p.fuzzed_lng}, ${p.fuzzed_lat}), 4326)::geography, ${escapeSql(p.address_hint)}, ${escapeSql(p.land_type)}, ${p.private_owner_consent}, ${escapeSql(p.notes)}, ${escapeSql(p.source)}, ${escapeSql(p.attribution)}, ${escapeSql(p.license)}, ${escapeSql(p.status)}, ${p.is_sacred_heritage}, ${escapeSql(p.heritage_story || null)} FROM species WHERE scientific_name = ${escapeSql(p.species_scientific_name)} ON CONFLICT DO NOTHING;`
    );
  }

  const outputPath = path.resolve(__dirname, '../supabase/seed_data.sql');
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`Generated ${outputPath} (${lines.length} SQL statements)`);
}

generate();

