# DECISIONS.md - Architectural & Design Decision Records (ADR)

This file tracks significant technical, architectural, and design decisions made during the development of Vriksha.

---

## ADR 001: Technology Stack Selection
- **Status**: Accepted
- **Context**: Vriksha needs a fast, mobile-friendly, offline-capable mapping application with spatial querying, authentication, and zero required paid map subscriptions.
- **Decision**:
  - Frontend: Vite + React 19 + TypeScript (`strict: true`) + Tailwind CSS + Radix UI / shadcn/ui primitives.
  - Map Engine: MapLibre GL JS with free Carto Voyager and OpenStreetMap tiles (no paid Mapbox access tokens).
  - Backend: Supabase (PostgreSQL 15+ with PostGIS 3 extension), Supabase Auth (Phone OTP + Google), Supabase Storage, and Deno Edge Functions.
  - State & Offline: Dexie.js (IndexedDB) for offline submission and verification queues; `vite-plugin-pwa` for service worker offline shell and tile caching.
- **Consequences**: Zero recurring map license fees, fully standards-compliant, and runs seamlessly on budget mobile devices in India.

---

## ADR 002: Server-Enforced Coordinates Fuzzing for Restricted Species
- **Status**: Accepted
- **Context**: Sensitive and endangered species (e.g. *Santalum album* / Sandalwood, *Pterocarpus santalinus* / Red Sanders, rare Himalayan medicinal herbs) are vulnerable to poaching if exact GPS coordinates are exposed.
- **Decision**:
  - The database maintains a `fuzzed_location` generated via `ST_SnapToGrid(location::geometry, 0.05)::geography` (~5 km grid fuzzing).
  - The primary spatial discovery RPC (`nearest_plants`) strictly checks the caller's JWT role. If `role` is not `'moderator'` or `'admin'`, the RPC returns `fuzzed_location` instead of `location` whenever `is_restricted = true`.
  - Public table RLS blocks direct column access to `location` for restricted plants.
  - Open data exports explicitly exclude restricted species or replace coordinates with the fuzzed centroid.
- **Consequences**: Complete protection of endangered flora; proven via automated SQL test suites.

---

## ADR 003: Freshness System Single Source of Truth
- **Status**: Accepted
- **Context**: Physical plants have differing lifespans and seasonal vulnerabilities (a large peepal or banyan tree survives for centuries, while durva grass or small annual herbs can vanish in weeks). Client and server must strictly agree on freshness status.
- **Decision**:
  - Decay intervals:
    - Large tree: 0-18 months (`recently_verified`), 18-36 months (`needs_recheck`), >36 months (`possibly_gone`).
    - Shrub: 0-6 months (`recently_verified`), 6-12 months (`needs_recheck`), >12 months (`possibly_gone`).
    - Herb/grass: 0-2 months (`recently_verified`), 2-4 months (`needs_recheck`), >4 months (`possibly_gone`).
  - Two independent "gone" reports from distinct users transition status to `reported_gone`, filtering it out from public view.
  - A single "still here" confirmation resets `last_verified_at` to `now()` and restores `recently_verified`.
  - Logic is defined in `src/config/freshness.ts` on the client and mirrored in the Postgres function `calculate_plant_freshness` on the server.
- **Consequences**: Zero drift between server API responses and client-side UI calculation.

---

## ADR 004: Client-Side Image Compression Before Upload
- **Status**: Accepted
- **Context**: Modern smartphone cameras take photos ranging from 4 MB to 15 MB. Uploading raw photos exhausts user mobile data, drains battery, slows down the offline queue, and increases storage footprint.
- **Decision**:
  - Photos are compressed directly on the device using HTML5 Canvas (`toBlob` with WebP/JPEG format, max 800px on the longest dimension, ~80% quality).
  - Resulting file size is typically 60 KB – 120 KB (a 98% reduction) with zero perceptual quality loss on mobile screens.
- **Consequences**: Fast uploads even on 2G/3G connections, minimal storage costs, instant offline caching in IndexedDB.

---

## ADR 005: Falling Fruit Data Reuse Under CC BY-NC-SA
- **Status**: Accepted
- **Context**: Falling Fruit maintains crowdsourced urban foraging data. We must ensure licensing compliance before ingesting any records into Vriksha.
- **Decision**:
  - Falling Fruit data is licensed under CC BY-NC-SA. Because Vriksha is a non-profit, free community utility, this license is legally compatible.
  - All imported records must display `"Imported via Falling Fruit (CC BY-NC-SA)"` and deep link to the original record URL.
- **Consequences**: Verified legal compliance recorded in `DATA_SOURCES.md`.
