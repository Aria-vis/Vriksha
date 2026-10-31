# CHANGELOG.md - Vriksha Progress & Release Notes

All notable changes to the **Vriksha** project are documented in this file, structured milestone by milestone.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Milestone 7: Internationalization, PWA & Outdoor Visibility Pass] - 2026-10-31

### Added
- **Multi-Language Architecture (`src/i18n`)**:
  - Full translations for English (`en`) and Hindi (`hi`).
  - Native script translation stubs for 9 regional Indian languages: Bengali (`bn`), Tamil (`ta`), Telugu (`te`), Marathi (`mr`), Gujarati (`gu`), Kannada (`kn`), Malayalam (`ml`), Punjabi (`pa`), and Odia (`or`).
  - Seamless fallback mechanism preserving UI completeness when a localized string is missing in regional stubs.
  - Persistent language selection saved across sessions in `localStorage` (`vriksha_language`).
- **Interactive Language Switcher (`Header.tsx`)**:
  - Compact header dropdown showing native script names (हिन्दी, தமிழ், తెలుగు, বাংলা, etc.) with active language indicator.
- **Outdoor High-Contrast Glare Mode**:
  - High-contrast toggle in header (`SunMedium`) designed specifically for outdoor foragers under harsh Indian sunlight.
  - Elevates borders, contrast ratios, and font weights to meet WCAG AAA standards on outdoor mobile screens.
- **Accessibility Enhancements**:
  - Full keyboard accessibility and screen-reader `aria-label`, `aria-expanded`, and `role="listbox"` / `role="button"` tags across header controls, filter chips, and plant cards.
- **PWA Workbox Caching (`vite.config.ts`)**:
  - Automatic caching for Carto Voyager & OpenStreetMap raster tiles (max 1000 entries, 30 days) with `CacheFirst` strategy.
  - Offline app shell pre-caching 11 core bundles, SVGs, and manifests via `generateSW`.
- **Testing & Verification**:
  - `tests/unit/i18n.test.ts`: 5 tests verifying 11-language catalog, English and Hindi translation parity, regional fallback, and `localStorage` persistence.

---

## [Milestone 6: Moderation Dashboard & Privacy Protection] - 2026-10-31

### Added
- **Restricted Species Privacy Shield (`nearest_plants` PostGIS RPC & ADR 002)**:
  - Strict ~5 km grid centroid coordinate fuzzing for vulnerable and commercially targeted flora (*Santalum album* / Sandalwood, *Pterocarpus santalinus* / Red Sanders).
  - Exact coordinates accessible exclusively to users with `moderator` or `admin` roles, preventing illegal poaching and commercial exploitation.
  - Automated test suite (`tests/unit/moderationAndPrivacy.test.ts`) proving coordinates cannot leak to standard users and verify ~5 km displacement.
- **Comprehensive Privacy Policy Modal (`PrivacyPolicyModal.tsx`)**:
  - Explains the ~5 km fuzzy location shield for restricted flora.
  - Documents zero contributor location tracking (contributor home locations are never requested, stored, or revealed).
  - Mandatory private property consent and landowner approval policy.
  - Clear sustainable harvesting etiquette guidance (take only leaves needed, never strip bark or uproot, ask permission).
- **Moderation Dashboard (`ModerationDashboard.tsx`)**:
  - Tabbed interface uniting community report queue, duplicate tree cleanup, species privacy management, and audit log.
- **Community Report Queue (`ReportQueue.tsx`)**:
  - Actionable queue for tree gone reports, wrong species flags, private property removal requests, and spam.
  - Allows moderators to review community feedback and take down invalid listings with 1 tap.
- **Duplicate Tree Merge Tool (`DuplicateMergeTool.tsx` & `duplicateDetection.ts`)**:
  - Spatial deduplication utility detecting matching species records within 15–25 meters.
  - Side-by-side comparison interface enabling moderators to select the canonical record and consolidate photo timelines and verification history.
- **Species Protection Manager (`SpeciesManagement.tsx`)**:
  - Searchable interface allowing moderators to toggle the restricted species fuzzing shield dynamically across all 80 species.
- **Testing & Verification**:
  - `tests/unit/moderationAndPrivacy.test.ts`: 5 tests verifying restricted species coordinate displacement, unmasking for moderators, and spatial duplicate clustering.

---

## [Milestone 5: Festival & Puja Mode + Trip Planner] - 2026-10-31

### Added
- **Festival Calendar & Strip (`FestivalCalendar.tsx`)**:
  - Top header strip displaying upcoming Indian occasions with English & Hindi titles, lunar tithi dates, and plant checklist counts.
  - One-tap launch of ritual checklists for Maha Shivratri, Dussehra, Ganesh Chaturthi, Diwali, Chhath Puja, Tulsi Vivah, etc.
- **Interactive Ritual Plant Checklist (`FestivalChecklist.tsx`)**:
  - Live availability detector showing nearest distance for each required ritual plant.
  - Puja basket checklist tracker allowing users to mark items as collected.
  - Regional ritual variations disclaimer banner noting that ritual requirements vary by sampradaya and tradition, with moderated community edits enabled.
- **Traveling Salesperson Route Optimizer (`routePlanner.ts` & `TripPlannerModal.tsx`)**:
  - Greedy Nearest-Neighbor TSP solver ordering candidate collection points to minimize cumulative travel distance.
  - Calculates total distance, estimated walking time (~75 m/min), and driving time (~330 m/min).
  - Single-tap deep link into Google Maps with origin, destination, and all intermediate waypoints prefilled.
- **Testing & Verification**:
  - `tests/unit/routePlanner.test.ts`: Proves nearest-neighbor sorting and valid Google Maps multi-stop URL generation.
  - `tests/components/FestivalChecklist.test.tsx`: Tests rendering of checklist, distance indicators, basket checkbox progress, and modal launcher.

---

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
