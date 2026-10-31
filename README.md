# Vriksha (वृक्ष) 🌿
> **"Google Maps for trees and plants"** across India for everyday, puja, festival, and home remedy needs.

[![Vriksha CI](https://github.com/vriksha/vriksha/actions/workflows/ci.yml/badge.svg)](https://github.com/vriksha/vriksha/actions)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-forestgreen.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)

---

## 🌸 About Vriksha

**Vriksha** is a free, non-profit, community-powered map of useful trees and plants across India. 

When someone needs:
- **Puja & Festival plants**: Bilva (bael) leaves & Dhatura for Maha Shivratri, Shami leaves for Dussehra, Mango leaves & Durva grass for Ganesh Chaturthi, Tulsi for Tulsi Vivah, or Peepal for Vat Savitri.
- **Home & Ayurvedic remedies**: Fresh Neem leaves for chickenpox/skin soothing, Tulsi for cough relief, Adhatoda (Vasaka) for breathing, Kadi Patta (Curry leaves), or Moringa (Drumstick).
- **Daily household needs**: Lemon grass, Hibiscus (Gudhal) for daily puja, or cooling shade.

Vriksha answers three essential questions in real time:
1. **Where is the nearest one?** (Sorted by walking or driving distance)
2. **Is it still physically there?** (Dynamic Freshness verification system)
3. **Is it currently in season?** (12-month flowering, fruiting, and leafing strip)

> **Note**: Vriksha is a practical everyday **utility tool**, *not* an academic taxonomy catalog or conservation census.

---

## ⚡ Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or later
- npm v10 or later

### Installation & Local Run
```bash
# 1. Clone the repository
git clone https://github.com/vriksha/vriksha.git
cd vriksha

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Start local development server
npm run dev
```

Visit `http://localhost:5173` to explore the application.

---

## 🛠️ Development & Quality Commands

Vriksha enforces strict verification. Every milestone must pass all checks:

```bash
# Typecheck with strict TypeScript
npm run typecheck

# Lint with ESLint
npm run lint

# Run unit and component test suites (Vitest)
npm test

# Run tests in watch mode
npm run test:watch

# Run Playwright end-to-end tests
npm run test:e2e

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛡️ Safety, Ethics & Privacy Protections

1. **Restricted Species Shield**: Vulnerable or commercially sensitive species (*Santalum album* / Sandalwood, *Pterocarpus santalinus* / Red Sanders) **never** reveal exact coordinates to standard users or open exports. Coordinates are fuzzed to a ~5 km grid centroid. Exact coordinates are restricted to verified moderators and administrators.
2. **Harvesting Etiquette Banner**: Every plant page prominently displays harvesting guidelines:
   > *"Take only a few leaves or fallen twigs. Never strip bark, branches, or roots. Always ask permission on temple, institutional, or private grounds."*
3. **Toxicity Warnings**: Toxic species (e.g., Dhatura, Calotropis/Aak, Kaner/Oleander) carry high-contrast danger warnings.
4. **Medical Disclaimer**: All medicinal descriptions carry: *"Traditional use. Not medical advice."*
5. **Private Property Consent**: Markings on private land require explicit landowner permission confirmation.
6. **Zero Contributor Location Tracking**: Contributor home locations are never stored or exposed.
7. **Moderator Tools & Community Review**: In-app moderation dashboard (`ModerationDashboard.tsx`) with community report review queue, duplicate tree merging tool (`duplicateDetection.ts`), and dynamic species privacy toggle.
8. **In-App Privacy Policy**: Transparent modal (`PrivacyPolicyModal.tsx`) detailing exact privacy guarantees and botanical protection policies.

---

## 🕒 Freshness System

Plants decay according to physical lifespan:
- **Large Tree** (Peepal, Banyan, Neem, Mango, Bael):
  - `recently_verified`: 0 – 18 months
  - `needs_recheck`: 18 – 36 months
  - `possibly_gone`: > 36 months
- **Shrub** (Tulsi, Hibiscus, Shami, Kaner):
  - `recently_verified`: 0 – 6 months
  - `needs_recheck`: 6 – 12 months
  - `possibly_gone`: > 12 months
- **Herb / Grass** (Durva grass, small herbs):
  - `recently_verified`: 0 – 2 months
  - `needs_recheck`: 2 – 4 months
  - `possibly_gone`: > 4 months
- **Negative Verification**: 2 independent "gone" reports automatically hide the plant from default search. A single "still here" restores status.

---

## 🌟 Key Community Features & Tools

- **Festival & Puja Mode**: First-of-its-kind ritual planner featuring checklists of required sacred flora for 12+ Indian festivals (Maha Shivratri, Ganesh Chaturthi, Dussehra, Tulsi Vivah, Chhath Puja, etc.) and a Traveling Salesperson Problem (TSP) multi-stop walking route optimizer ("Plan My Trip").
- **Community "Need It / Have It" Board**: Neighborhood bulletin board connecting tree guardians with puja seekers for sharing excess garden blossoms and requesting festival leaves.
- **Sacred & Heritage Tree Stories**: Living cultural monuments catalog (Akshaya Vat in Prayagraj, Kabir Vad in Bharuch, Dodda Alada Mara in Bengaluru, Varanasi 700-year Bilva tree, Kurukshetra Jyotisar Vat) with folklore and conservation notes.
- **Civic Nurseries & Free Saplings**: Directory of official state forest department nurseries offering free or subsidized saplings during Van Mahotsav and seasonal plantation drives.
- **Printable Plant QR Posters**: 1-click printable tree steward poster generator with high-contrast QR code, seasonality calendar, and harvesting etiquette for parks, schools, temples, and residential societies.
- **Open Data Export**: 1-tap download of the Vriksha community tree dataset in GeoJSON (`FeatureCollection`) and CSV formats under CC BY-SA 4.0, preserving species privacy via PostGIS ~5 km coordinate fuzzing.
- **Voice Search**: Hands-free search built on the native Web Speech API supporting spoken queries in Indian English (`en-IN`) and Hindi (`hi-IN`).
- **11 Indian Languages**: Full translations in English and Hindi, plus native script stubs for Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia.
- **Outdoor High-Contrast Glare Mode**: One-tap toggle optimizing contrast and typography for sunlight readability in gardens and roadsides.
- **PWA & Offline Queue**: Workbox tile and app caching with Dexie.js (IndexedDB) offline submission queue that automatically syncs when connectivity is restored.

---

## 🧪 Automated Testing Architecture

Vriksha features 100% automated coverage across unit, component, spatial, and browser flows:
- **Vitest Unit & Component Tests** (`npm test`): 68 tests across 15 test suites validating freshness decay algorithms, route optimization, image compression, Dexie offline queue, i18n translation fallbacks, species data integrity, and moderation workflows.
- **Playwright E2E Suite** (`npm run test:e2e`): 3 automated user journeys executed against real Chromium:
  1. *Flow 1*: Header rendering, quick city switcher, and search/filter interactions.
  2. *Flow 2*: 3-step Add Plant wizard modal with strict private property consent validation.
  3. *Flow 3*: Festival & Puja Mode checklist interaction and route trip planner.

---

## 📜 Documentation

- [AGENTS.md](file:///c:/Users/Swapnil/OneDrive/Desktop/Programming/Vriksha/AGENTS.md): Agent working conventions and non-negotiable rules.
- [PLAN.md](file:///c:/Users/Swapnil/OneDrive/Desktop/Programming/Vriksha/PLAN.md): Master architecture and milestone specifications.
- [DATA_SOURCES.md](file:///c:/Users/Swapnil/OneDrive/Desktop/Programming/Vriksha/DATA_SOURCES.md): Licensing compliance and external data registry.
- [DECISIONS.md](file:///c:/Users/Swapnil/OneDrive/Desktop/Programming/Vriksha/DECISIONS.md): Architectural Decision Records (ADRs).
- [CHANGELOG.md](file:///c:/Users/Swapnil/OneDrive/Desktop/Programming/Vriksha/CHANGELOG.md): Milestone progress log.

