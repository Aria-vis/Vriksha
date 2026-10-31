# CHANGELOG.md - Vriksha Progress & Release Notes

All notable changes to the **Vriksha** project are documented in this file, structured milestone by milestone.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Milestone 4: Data Import Pipeline & Attribution UI] - 2026-10-31

### Added
- **OpenStreetMap Overpass Service & Ingestion Tool**:
  - `src/services/overpassService.ts`: Bounding box and radius Overpass query builders, normalizer with ODbL licensing and OSM contributor attribution.
  - `scripts/import-osm-overpass.ts`: CLI script querying Overpass API for trees across Indian cities and mapping them to Vriksha's 80 species.
- **iNaturalist Research-Grade API Service & Ingest Script**:
  - `src/services/inaturalistService.ts`: India-focused (`place_id=6681`) query builder for useful species.
  - Strict license validator: Ingests only CC0, CC BY, and CC BY-NC observations; strictly excludes all-rights-reserved records.
  - Respects coordinate obscuration and attaches observer credit + photo licenses.
  - `scripts/import-inaturalist.ts`: CLI ingest tool with rate limiting and logging.
- **Attribution & Provenance UI**:
  - Prominent Source Provenance Card in `PlantDetailSheet.tsx` displaying data source (`OSM`, `iNaturalist`, `Community`), license badge (`ODbL`, `CC BY-NC 4.0`), and author attribution string.
  - Compact provenance chip on all `PlantCard.tsx` items.
- **Testing & Verification**:
  - `tests/unit/dataImport.test.ts`: 6 unit tests covering Overpass queries, ODbL normalizer, and iNaturalist open license compliance.

---

## [Milestone 3: Auth, Add Plant, Verify/Report Flow & Offline Queue] - 2026-10-31

### Added
- **Authentication & Contributor Profiles**:
  - Supabase Phone OTP and Google OAuth integration with transparent guest contributor browsing.
  - Profile state tracking contributor points: +10 pts for mapping a plant, +2 pts for ground-truth verification.
  - Dedicated `AuthModal` with quick 10-digit Indian phone OTP and 1-tap Google login.
- **Client-Side Image Compressor (`imageCompression.ts`)**:
  - HTML5 Canvas downscaler capping dimensions to 800x800 preserving aspect ratio.
  - Converts uploads to high-quality WebP/JPEG under 120 KB, reducing bandwidth by 85–95% on mobile connections.
- **Offline Submission & Verification Queue (`db.ts` & `useOfflineQueue.ts`)**:
  - IndexedDB storage powered by Dexie.js (`pendingSubmissions`, `pendingVerifications`, `cachedPlants`).
  - Online/offline event listeners automatically syncing queued contributions when network connectivity resumes.
  - Discreet `OfflineBadge` displaying queue counts and manual sync trigger.
- **"Add a Plant" Wizard (`AddPlantModal.tsx`)**:
  - Step 1: Photo upload with real-time compression statistics preview.
  - Step 2: Species selector (`SpeciesPicker.tsx`) with search over 80 species, categories, and "Not sure / Help identify" option.
  - Step 3: Location micro-adjuster (`LocationAdjuster.tsx`) with GPS nudge controls and landmark hint input.
  - **Private Property Safety**: Mandatory consent confirmation checkbox strictly required before submission on private land.
  - Confetti celebration animation upon submission.
- **Ground-Truth Verification & Reporting**:
  - "Still here" one-tap verification resetting freshness decay and awarding contributor points.
  - "Report gone" flow for negative verification logging.
- **Comprehensive Unit & Component Tests**:
  - `tests/unit/imageCompression.test.ts`: Proportional downscaling, aspect ratios, and format sizing.
  - `tests/unit/offlineQueue.test.ts`: Dexie table persistence and queuing.
  - `tests/components/AddPlantModal.test.tsx`: Step navigation and private land consent enforcement.

---

## [Milestone 2: Map, Search, Filters, Detail & Freshness Badges] - 2026-10-31

### Added
- **Interactive Map Experience**:
  - MapLibre GL JS integration with Carto Voyager open raster tiles (no paid API keys required).
  - Geolocation detection with fallback to 7 major Indian cities (Varanasi, Patna, Delhi, Bengaluru, Mumbai, Kolkata, Chennai).
  - Freshness-colored markers with pulse indicators and active selection state.
- **Search & Filter Suite**:
  - Real-time search by English name, Hindi name, scientific botanical name, and use-case tags.
  - Horizontal filter chips: Puja, Medicinal, Fruit, Shade, Flowers, Edible, In season now, and Recently verified.
- **Mobile-First Nearest Bottom Sheet**:
  - Pull-to-expand drawer with nearest-first sorted plant cards.
  - Quick distance formatting (`120 m`, `2.4 km`) and relative time stamps (`verified 2 weeks ago`).
- **Comprehensive Plant Detail Sheet**:
  - Seasonality strip showing 12-month flowering, fruiting, and leaf cycle with live "In Season Now" badge.
  - Direct navigation link to Google Maps driving/walking directions.
  - Freshness actions: "Still here" verification and "It's gone" negative reporting.
  - Regional vernacular names in 10 Indian languages.
  - Harvesting etiquette banner, toxicity warnings (e.g. Dhatura/Kaner/Aak), medical disclaimers, and restricted species shield.
- **Proximity Verification Prompt**:
  - Automatic prompt ("Is this plant still here?") displayed when within 100 meters of a `needs_recheck` plant, capped to once every 24 hours.
- **Client Testing**:
  - Component tests for `PlantCard` and `SeasonalityStrip`.
  - Integration tests for `plantsApi` with offline mock database fallback.

---

## [Milestone 1: Database Schema, PostGIS RPCs, RLS & Species Seed] - 2026-10-31

### Added
- **PostgreSQL & PostGIS Schema**: Created migrations in `supabase/migrations/`:
  - `001_initial_schema.sql`: 14 relational tables with PostGIS `geography(Point, 4326)` types, spatial GIST indices, and foreign key constraints.
  - `002_freshness_and_triggers.sql`: Single source of truth decay calculation `calculate_plant_freshness` and automated triggers for coordinate fuzzing and status updates.
  - `003_rls_policies.sql`: Row Level Security enabled on all 14 tables. Enforced spatial privacy shielding exact coordinates of restricted species from non-moderators.
  - `004_spatial_rpcs.sql`: High-performance PostGIS discovery RPC `nearest_plants` with automatic ~5 km centroid fuzzing for restricted species and `get_festival_plant_locations` for ritual route planning.
- **Master Species Taxonomy Seed**:
  - Curated 80 authentic useful Indian trees and plants with botanical taxonomy, 12-month seasonality arrays (flowering, fruiting, leaves), toxicity details, and parts used.
  - Vernacular synonym registry with names in Hindi, Sanskrit, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia.
- **Festival & Occasion Data**: Seeded 12 major Indian festivals with required plant checklists, flagged with `needs_local_review = true`.
- **Realistic Demo Clusters**: Seeded demo plants across Patna, Varanasi, Delhi, and Bengaluru behind `SEED_DEMO=true` with offline fallback cache (`public/data/mock-db.json`).
- **Testing & Verification**:
  - `supabase/tests/rls_privacy_test.sql`: Verifies restricted species cannot leak coordinates to standard users.
  - `supabase/tests/nearest_plants_test.sql`: Tests spatial radius filters and decay math.
  - `tests/unit/freshness.test.ts`: 11 unit tests covering all decay windows and gone report transitions.
  - `tests/unit/dataModel.test.ts`: 7 unit tests verifying taxonomy integrity, restricted species protection, and spatial displacement.

---

## [Milestone 0: Scaffold & Infrastructure] - 2026-10-31

### Added
- **Project Foundation**: Initialized Vite + React 18 + TypeScript strict repository.
- **Styling Architecture**: Tailwind CSS configuration with warm earthy palette (forest green `#1B4D3E`, terracotta `#C85A32`, saffron `#E67E22`, warm cream `#FDFBF7`).
- **Testing Infrastructure**: Configured Vitest, React Testing Library, jsdom environment, and Playwright E2E framework. Added initial test suite verifying DOM and geolocation mocks.
- **Continuous Integration**: Added GitHub Actions workflow (`.github/workflows/ci.yml`) enforcing linting, typechecking, test suites, and production build checks.
- **PWA Infrastructure**: Configured `vite-plugin-pwa` with web app manifest and offline caching rules for MapLibre/Carto/OSM tiles.
- **Documentation & Governance**:
  - `AGENTS.md`: Core working conventions, testing gates, and safety constraints.
  - `PLAN.md`: Full architectural specification, PostGIS data model, 9-milestone roadmap, and risk analysis.
  - `DATA_SOURCES.md`: Official terms, API limits, and CC BY-NC-SA compliance for Falling Fruit, OSM Overpass, and iNaturalist.
  - `DECISIONS.md`: Architectural Decision Records (ADRs 001–005).
  - `.env.example`: Environment variable template.
