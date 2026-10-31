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

## 📜 Documentation

- [AGENTS.md](file:///c:/Users/Swapnil/OneDrive/Desktop/Programming/Vriksha/AGENTS.md): Agent working conventions and non-negotiable rules.
- [PLAN.md](file:///c:/Users/Swapnil/OneDrive/Desktop/Programming/Vriksha/PLAN.md): Master architecture and milestone specifications.
- [DATA_SOURCES.md](file:///c:/Users/Swapnil/OneDrive/Desktop/Programming/Vriksha/DATA_SOURCES.md): Licensing compliance and external data registry.
- [DECISIONS.md](file:///c:/Users/Swapnil/OneDrive/Desktop/Programming/Vriksha/DECISIONS.md): Architectural Decision Records (ADRs).
- [CHANGELOG.md](file:///c:/Users/Swapnil/OneDrive/Desktop/Programming/Vriksha/CHANGELOG.md): Milestone progress log.
