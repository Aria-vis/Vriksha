import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { SEED_SPECIES } from './data/species-data';
import { SEED_FESTIVALS } from './data/festival-data';
import { SEED_DEMO_PLANTS } from './data/demo-plants-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  console.log('🌱 [Vriksha Seed Engine] Starting dataset preparation...');

  // Auto-load .env if not loaded by process
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        if (k && !process.env[k.trim()]) {
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    }
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const isRealSupabase = supabaseUrl && !supabaseUrl.includes('mock.supabase.co') && serviceRoleKey && !serviceRoleKey.includes('mock');

  // Build the complete combined dataset structure
  const completeData = {
    species: SEED_SPECIES.map((s, index) => ({
      id: `00000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
      ...s
    })),
    festivals: SEED_FESTIVALS.map((f, index) => ({
      id: `f0000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
      slug: f.slug,
      name_en: f.name_en,
      name_hi: f.name_hi,
      description_en: f.description_en,
      description_hi: f.description_hi,
      typical_month: f.typical_month,
      lunar_tithi_desc: f.lunar_tithi_desc,
      next_observed_date: f.next_observed_date,
      region: f.region,
      needs_local_review: f.needs_local_review,
      checklist: f.checklist,
    })),
    plants: SEED_DEMO_PLANTS,
    generatedAt: new Date().toISOString(),
  };

  // Write precomputed JSON to public/data/mock-db.json for offline demo & mock fallback
  const publicDataDir = path.resolve(__dirname, '../public/data');
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }

  const outputPath = path.join(publicDataDir, 'mock-db.json');
  fs.writeFileSync(outputPath, JSON.stringify(completeData, null, 2), 'utf-8');
  console.log(`✅ [Vriksha Seed Engine] Precomputed database cached at ${outputPath}`);
  console.log(`   - Species seeded: ${completeData.species.length}`);
  console.log(`   - Festivals seeded: ${completeData.festivals.length}`);
  console.log(`   - Demo plants seeded: ${completeData.plants.length} (Patna, Varanasi, Delhi, Bengaluru)`);

  if (isRealSupabase) {
    console.log(`🚀 [Vriksha Seed Engine] Connecting to Supabase at ${supabaseUrl}...`);
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Seed species
    for (const s of completeData.species) {
      const { data: speciesRecord, error: spErr } = await supabase
        .from('species')
        .upsert({
          scientific_name: s.scientific_name,
          common_name_en: s.common_name_en,
          common_name_hi: s.common_name_hi,
          plant_type: s.plant_type,
          use_tags: s.use_tags,
          parts_used: s.parts_used,
          seasonality_flowering: s.seasonality_flowering,
          seasonality_fruiting: s.seasonality_fruiting,
          seasonality_fresh_leaves: s.seasonality_fresh_leaves,
          is_toxic: s.is_toxic,
          toxicity_details: s.toxicity_details,
          is_restricted: s.is_restricted,
          conservation_status: s.conservation_status,
          harvesting_etiquette: s.harvesting_etiquette,
          needs_review: s.needs_review,
        }, { onConflict: 'scientific_name' })
        .select()
        .single();

      if (spErr) {
        console.warn(`   ⚠️ Species error (${s.scientific_name}):`, spErr.message);
        continue;
      }

      if (speciesRecord && s.local_names) {
        for (const ln of s.local_names) {
          await supabase.from('species_local_names').upsert({
            species_id: speciesRecord.id,
            language_code: ln.language_code,
            local_name: ln.local_name,
            transliteration: ln.transliteration || null,
          }, { onConflict: 'species_id,language_code,local_name' });
        }
      }
    }
    console.log('   ✅ Species and vernacular synonyms seeded to Supabase.');
  } else {
    console.log('ℹ️ [Vriksha Seed Engine] No live Supabase credentials configured. Running in Mock/Offline mode.');
  }

  console.log('✨ [Vriksha Seed Engine] Seeding complete.');
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
