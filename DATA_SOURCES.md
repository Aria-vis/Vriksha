# DATA_SOURCES.md - Data Source Registry & Licensing Compliance

This document records the official policies, verified API endpoints, usage limits, and licensing terms for every external data source used in **Vriksha**.

---

## 1. Falling Fruit

- **Official Source**: [Falling Fruit](https://fallingfruit.org)
- **API Documentation**: [Falling Fruit API Docs (v0.3)](https://fallingfruit.org/api) & [GitHub Repo](https://github.com/falling-fruit/falling-fruit)
- **Data License**: **Creative Commons Attribution-NonCommercial-ShareAlike 3.0/4.0 (CC BY-NC-SA)**
- **Code License**: GNU GPLv3
- **Commercial Use Restriction**: Explicitly non-commercial without prior written authorization.
- **Compatibility with Vriksha**: Compatible because Vriksha is 100% free, non-profit, open-source, and non-commercial.
- **Compliance Requirements**:
  1. Any imported Falling Fruit entry must retain `license = 'CC BY-NC-SA'`.
  2. Clear attribution must be displayed: `"Imported via Falling Fruit (CC BY-NC-SA)"`.
  3. Deep link back to the specific Falling Fruit location URL.
  4. Any export containing Falling Fruit data must inherit CC BY-NC-SA terms.

---

## 2. OpenStreetMap (OSM) via Overpass API

- **Official Source**: [OpenStreetMap](https://www.openstreetmap.org)
- **API Endpoint**: `https://overpass-api.de/api/interpreter` (or mirrors such as `https://lz4.overpass-api.de/api/interpreter`)
- **Data License**: **Open Database License (ODbL 1.0)**
- **Query Strategy**:
  - Filter: `node["natural"="tree"]` within user bounding boxes or radius queries.
  - Target tags: `species`, `species:en`, `species:hi`, `genus`, `taxon`, `name`.
- **Rate Limits & Caching**:
  - Respect Overpass public etiquette: no rapid polling, client query debounce, server-side caching with 30-day TTL.
- **Attribution Display**:
  - Prominent UI footer and card attribution: `"© OpenStreetMap contributors, ODbL"`.

---

## 3. iNaturalist

- **Official Source**: [iNaturalist](https://www.inaturalist.org)
- **API Endpoint**: `https://api.inaturalist.org/v1/`
  - Observations: `GET /v1/observations?place_id=6681&taxon_id=...&quality_grade=research`
  - Computer Vision / Identification Suggestion: `POST /v1/computervision/score_image`
- **Data Licensing**:
  - Observations carry individual per-user licenses (CC0, CC BY, CC BY-NC, or All Rights Reserved).
  - **Import Filter**: Only records with open licenses (`cc0`, `cc-by`, `cc-by-nc`, `cc-by-sa`, `cc-by-nc-sa`) will be ingested. Observations marked "All Rights Reserved" are strictly excluded.
- **Coordinates & Obscuration**:
  - iNaturalist obscures coordinates for threatened or endangered species to a random point within a ~0.2 x 0.2 degree box (~22 km). Vriksha respects this obscuration and additionally enforces its own 5-km fuzzing on restricted species.
- **Attribution Display**:
  - Displays: `"Photo / Observation by [observer_name] via iNaturalist ([license])"`, with direct hyperlink to `https://www.inaturalist.org/observations/[id]`.

---

## 4. Global Biodiversity Information Facility (GBIF)

- **Official Source**: [GBIF.org](https://www.gbif.org)
- **API Endpoint**: `https://api.gbif.org/v1/occurrence/search`
- **Data License**: **CC0 1.0, CC BY 4.0, or CC BY-NC 4.0** (filtered at query time via `license=CC0_1_0&license=CC_BY_4_0`).
- **Attribution Display**:
  - Stored and displayed as `"GBIF Occurrence [occurrenceID], contributed by [institutionCode]"`.

---

## 5. India Biodiversity Portal (IBP) & eFloraofIndia

- **Sources**: [India Biodiversity Portal](https://indiabiodiversity.org) & [eFloraofIndia](https://efloraindia.bsi.gov.in)
- **Usage Policy**:
  - **Reference & Verification Only**: Used solely to verify vernacular regional names, botanical nomenclature, and flowering/fruiting seasonality patterns.
  - **No Scraping or Wholesale Replication**: Text or copyrighted descriptions are never scraped or stored directly into the database. UI includes external reference buttons: *"View on India Biodiversity Portal"*.

---

## 6. OpenStreetMap Tile Providers (Basemap)

- **Provider**: CartoDB Voyager / Positron (open tier) and OpenStreetMap Standard tile caches.
- **License**: Free open raster/vector tiles for open-source / non-commercial use with required attribution: `"© OpenStreetMap contributors, © CARTO"`.
- **Zero Paid Keys**: Fully operable without credit card or paid Mapbox/Google token requirement.
