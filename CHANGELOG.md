# CHANGELOG.md - Vriksha Progress & Release Notes

All notable changes to the **Vriksha** project are documented in this file, structured milestone by milestone.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
