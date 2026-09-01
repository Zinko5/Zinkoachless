# Project Progress & Roadmap

## What Works 
- [x] **Data Scraping (`get-wpa.py`):**
  - POST requests to Coachless API endpoints.
  - Multi-patch range iteration (Patches 16.1 to 16.16).
  - Intelligent patch caching system.
  - Exception handling with exponential retries (`safe_fetch`).
- [x] **Data Transformation (`process_wpa.py`):**
  - Multi-category normalization (8 sections: Keystones, Spells, Starters, Boots, 1st, 2nd, 3rd, 4th+ items).
  - Sample-weighted average WPA calculation ($\text{WPA}_{\text{weighted}}$).
  - Dynamic Riot Games DDragon CDN integration for icons & localized names.
  - Automatic export to CSV (`data/processed/`) and web JS bundle (`docs/data.js`).
- [x] **Web Dashboard (`docs/`):**
  - Vanilla JS SPA with zero runtime dependencies.
  - Real-time client-side patch range filtering (From Patch / To Patch).
  - Dynamic champion selector (Lucian, Smolder).
  - Interactive table header sorting (WPA / Pick count).
  - Dark mode aesthetic with glassmorphic cards and crisp layout.
- [x] **Memory Bank:**
  - Initialized standard Memory Bank system (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`).

---

## What's Left to Build ⌛
- [ ] Add more ADC & midlane champions to `get-wpa.py` and `docs/index.html`.
- [ ] Implement an Item Details Modal using `GetItemDetailed` endpoint data.
- [ ] Add statistical confidence indicators (e.g. low sample size warnings for $N < 300$).
- [ ] Create automated daily/weekly patch check script.

---

## Known Issues & Technical Debts
- **Hardcoded Patch Arrays:** Currently `PATCHES` array in `get-wpa.py` is hardcoded up to 16; auto-discovery of available patches from Riot/Coachless APIs would streamline maintenance.
