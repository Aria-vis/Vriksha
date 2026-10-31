# AGENTS.md - Vriksha Project Conventions & Agent Operating Guidelines

This document establishes the architectural principles, development conventions, working constraints, and commands for AI agents and human contributors working on the **Vriksha** repository.

---

## 1. Project Purpose & Scope

**Vriksha** is a free, non-profit, community-powered map of useful trees and plants across India ("Google Maps for plants and trees").
- **Core Purpose**: Solve everyday household, puja, festival, and home-remedy needs (e.g. finding the nearest neem, bael, tulsi, shami, mango leaves, peepal, durva grass), checking whether the plant is still physically present (freshness system), and determining if it is currently in season.
- **Scope Boundary**: This is a practical, community-oriented **utility application**, **NOT** a botanical conservation census or academic taxonomy catalog.

---

## 2. Core Non-Negotiable Working Rules

1. **Plan First & Milestone Execution**:
   - Work strictly milestone-by-milestone (`M0` through `M8`).
   - Never proceed to the next milestone until the current milestone passes:
     - `npm run lint` (ESLint clean, no warnings or errors)
     - `npm run typecheck` (`tsc --noEmit` clean with TypeScript `strict` mode)
     - `npm test` (All unit tests and integration tests passing)
   - Update `README.md` and `CHANGELOG.md` at the completion of each milestone.
   - Commit with clear, descriptive commit messages matching conventional commits (e.g., `feat(m1): database migrations, RLS policies and spatial RPCs`).

2. **No Invented Data Sources or Licenses**:
   - **Never invent** data sources, API endpoints, or licenses.
   - Always verify against official documentation and record findings in `DATA_SOURCES.md`.
   - Every imported or community record must display source, source license, and proper attribution in the UI.

3. **User Decisions & Logged Assumptions**:
   - **MUST ASK the user before**:
     - Changing the core data model / database schema.
     - Introducing any paid service or API requiring a credit card or billing.
     - Storing any personally identifiable information (PII).
   - Autonomous reasonable technical choices must be transparently documented in `DECISIONS.md`.

4. **Secrets & Zero-Cost Infrastructure**:
   - Never commit API keys, service role secrets, or environment credentials.
   - Provide comprehensive `.env.example` templates.
   - Use only 100% free-tier or open services (OpenStreetMap / Carto / MapLibre open tile servers, Supabase free tier, iNaturalist free open API, Overpass API). No paid map keys (e.g., Mapbox token requirement without free tier fallback, Google Maps paid APIs).

5. **Safety, Ethics, and Privacy Constraints**:
   - **Restricted Species Protection**: Vulnerable, commercially sensitive, or endangered plants (e.g. *Santalum album* / Sandalwood, *Pterocarpus santalinus* / Red Sanders) **must never** expose exact coordinates to standard users, search APIs, or open data exports. Coordinates must be fuzzed to a ~5 km grid centroid. Exact coordinates are accessible solely to authenticated users with `role = 'moderator' | 'admin'` enforced via PostGIS RPCs and RLS.
   - **Private Property Consent**: Adding plants situated on private property strictly requires an explicit "owner is okay with sharing" boolean confirmation.
   - **Harvesting Etiquette**: Prominent banner reminding foragers to harvest responsibly (take only a few leaves, never strip branches or bark, ask permission on private/temple/institutional grounds).
   - **Medical Disclaimer**: All medicinal properties must be explicitly tagged: *"Traditional use. Not medical advice."*
   - **Toxicity Warnings**: Prominent visual danger warnings on toxic species (e.g., Dhatura, Calotropis/Aak, Kaner/Oleander).
   - **Zero Contributor Location Tracking**: Contributor home locations are never requested, stored, or revealed.

---

## 3. Technology Stack

- **Client**: Vite, React 18/19, TypeScript (`strict: true`), Tailwind CSS, Radix UI / shadcn/ui components, Lucide icons.
- **Mapping**: MapLibre GL JS with OpenStreetMap/Carto basemaps, supercluster for dynamic clustering.
- **Backend & Database**: Supabase (PostgreSQL 15+ with PostGIS 3 extension), Supabase Auth (Phone OTP + Google OAuth), Supabase Storage (bucket for plant photos), Supabase Edge Functions (Deno/TypeScript), Row Level Security (RLS) on all tables.
- **PWA & Offline Capability**: Vite PWA plugin (`vite-plugin-pwa`), Service Worker for offline app shell and cached map tiles, IndexedDB (via Dexie.js) offline submission and verification sync queue.
- **Internationalization**: `react-i18next` with full English (`en`) and Hindi (`hi`), plus localized stubs for Bengali (`bn`), Tamil (`ta`), Telugu (`te`), Marathi (`mr`), Gujarati (`gu`), Kannada (`kn`), Malayalam (`ml`), Punjabi (`pa`), and Odia (`or`).
- **Testing**:
  - Unit & Integration: Vitest, React Testing Library, jsdom.
  - End-to-End: Playwright (3 critical user flows: Browse/Search & Filter, Add Plant Offline/Online, Festival Checklist Trip Planner).
  - Database: SQL test suites (`pgTAP` / custom SQL assertions) verifying RLS policies, spatial proximity RPCs, and restricted species fuzzing.

---

## 4. Freshness System Architecture

Plants decay according to physical lifespan and seasonality characteristics:
- **Large Tree** (Peepal, Banyan, Neem, Mango, Bael):
  - `recently_verified`: 0 – 18 months
  - `needs_recheck`: 18 – 36 months
  - `possibly_gone`: > 36 months
- **Shrub** (Tulsi/shrub, Hibiscus/Gudhal, Shami, Kaner, Aak):
  - `recently_verified`: 0 – 6 months
  - `needs_recheck`: 6 – 12 months
  - `possibly_gone`: > 12 months
- **Herb / Small Plant / Grass** (Durva grass, small herbs):
  - `recently_verified`: 0 – 2 months
  - `needs_recheck`: 2 – 4 months
  - `possibly_gone`: > 4 months
- **Negative Verification**:
  - Two independent "gone" reports from distinct users automatically mark status as `reported_gone` and exclude from default public search.
  - A single "still here" confirmation from an authenticated user resets `last_verified_at = NOW()` and restores status to `recently_verified`.
- **Proximity Prompt**:
  - When an active user with location permission is within 100 meters of a `needs_recheck` plant, display a dismissible prompt ("Is this plant still here?"). Capped at once per plant per user per day.
- **Single Source of Truth**:
  - All thresholds are defined in `src/config/freshness.ts` on the client and mirrored in the Postgres view / function `plant_freshness_status` on the server.

---

## 5. Development Commands

```bash
# Install dependencies
npm install

# Start local Vite dev server
npm run dev

# Run TypeScript compiler type check
npm run typecheck

# Run ESLint linter
npm run lint

# Run Vitest unit & component test suite
npm test

# Run tests in watch mode
npm run test:watch

# Run Playwright end-to-end tests
npm run test:e2e

# Build production bundle
npm run build

# Preview production build
npm run preview

# Seed database / demo dataset
npm run seed
```

---

## 6. Repository File Structure Conventions

```text
/
├── .github/              # GitHub Actions CI workflows
├── public/               # Static assets, web app manifest, icons, tiles fallback
├── scripts/              # Seed scripts (OSM Overpass, iNaturalist, Demo data)
│   ├── seed-species.ts
│   ├── seed-festivals.ts
│   └── seed-demo-plants.ts
├── src/
│   ├── assets/           # Bundled icons, SVGs, graphics
│   ├── components/       # Reusable UI & domain components
│   │   ├── common/       # Header, Footer, DisclaimerBanner, OfflineBadge
│   │   ├── map/          # MapLibre container, markers, cluster layers, bottom sheet
│   │   ├── plant/        # PlantCard, PlantDetail, SeasonalityStrip, VerificationTimeline
│   │   ├── festival/     # FestivalCalendar, ChecklistCard, RoutePlanner
│   │   ├── forms/        # AddPlantForm, LocationPicker, PhotoUploadWithCompression
│   │   └── ui/           # shadcn/ui primitives (Button, Dialog, Sheet, Chip, Badge)
│   ├── config/           # Centralized configuration (freshness.ts, map.ts, constants.ts)
│   ├── hooks/            # Custom hooks (useGeolocation, useOfflineQueue, useFreshnessPrompt)
│   ├── i18n/             # Translations (en.json, hi.json, stubs) and i18next init
│   ├── lib/              # Client libraries (supabase.ts, db.ts, imageCompression.ts)
│   ├── services/         # API wrappers (overpass.ts, inaturalist.ts, geocoding.ts)
│   ├── types/            # TypeScript interfaces and Supabase database types
│   ├── App.tsx           # Route container & state providers
│   ├── main.tsx          # App entrypoint
│   └── index.css         # Tailwind & theme variables
├── supabase/
│   ├── functions/        # Supabase Edge Functions (Deno: inat-vision-suggest, overpass-proxy)
│   ├── migrations/       # Versioned SQL migration files
│   └── tests/            # SQL unit tests for RLS, RPCs, fuzzing
├── AGENTS.md             # This agent guideline
├── CHANGELOG.md          # Milestone-by-milestone change history
├── DATA_SOURCES.md       # Attribution, API docs, licenses, data reuse registry
├── DECISIONS.md          # Architectural & design decision records (ADRs)
├── PLAN.md               # Master implementation blueprint & milestones
└── README.md             # Project documentation, quickstart, and Lighthouse results
```
