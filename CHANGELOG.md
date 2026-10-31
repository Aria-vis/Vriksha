# CHANGELOG.md - Vriksha Progress & Release Notes

All notable changes to the **Vriksha** project are documented in this file, structured milestone by milestone.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
