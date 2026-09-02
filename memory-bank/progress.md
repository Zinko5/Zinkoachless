# Project Progress & Roadmap

## What Works 
- [x] **Data Scraping (`get-wpa.py`):**
  - POST requests to Coachless API endpoints.
  - Multi-patch range iteration (Patches 16.1 to 16.16).
  - Intelligent patch caching system.
  - Exception handling with exponential retries (`safe_fetch`).
- [x] **Data Transformation (`process_wpa.py`):**
  - Multi-category normalization (8 sections: Keystones, Spells, Starters, Boots, 1st, 2nd, 3rd, 4th+ items).
  - Recency-weighted WPA calculation ($\lambda = 0.75$, half-life $\approx 2.4$ patches).
  - Dynamic Riot Games DDragon CDN integration for icons & localized names.
  - Automatic export to CSV (`data/processed/`) and web JS bundle (`docs/data.js`).
- [x] **Multi-Entity Patch History Tracker (`patch_history.py`):**
  - Download & local cache of `item.json`, `runesReforged.json`, and `summoner.json` per patch from DDragon CDN.
  - Automated diffing of cost, stats, descriptions, and rune attributes across consecutive patches (978 entities tracked).
  - Export to `data/processed/item_patch_history.json`.
- [x] **Web Dashboard (`docs/`):**
  - Vanilla JS SPA with zero runtime dependencies.
  - Real-time client-side patch range filtering (From Patch 16.1 / To Patch 16.16).
  - **"Filtrar Post-Ajuste (⚡)"** checked by default: excludes pre-adjustment patches per item/rune to evaluate strictly post-change WPA.
  - **"⭐ Recomendado (Smart Rank)"** default composite sorting: combines recency WPA and log-sample confidence.
  - **Statistical Role Badges & Compact UX:** `⭐ Meta`, `🎯 Situacional / Hidden OP`, `📈 Emergente`, `⚡ Ajustado`.
  - **Dynamic Market Share Filter:** Mode 1 (`⭐ Populares & Solidez` - $0.5\%$ category sample cutoff) vs Mode 2 (`📚 Catálogo Completo` - 100% un-filtered).
  - **LoL Item Set Exporter:** Copies JSON payload directly to clipboard with custom `"Todos por WPA"` block.
  - Dynamic champion selector (Lucian, Smolder, Ekko, Gwen, Volibear, Annie, Warwick, Fiddlesticks, Viego, Samira, Briar, Shaco, Graves, Akali, Lux) con barra de selección de línea por icono oficial.
  - Dark mode aesthetic with glassmorphic cards and crisp layout.
- [x] **Memory Bank:**
  - Standard Memory Bank system fully maintained (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`).

---

## What's Left to Build ⌛
- [ ] Add more ADC, midlane, and jungle champions to `get-wpa.py` and `docs/index.html`.
- [ ] Implement an Item Details Modal using `GetItemDetailed` endpoint data.
- [ ] Create automated daily/weekly patch check script.

---

## Known Issues & Technical Debts
- **Hardcoded Patch Arrays:** Currently `PATCHES` array in `get-wpa.py` is hardcoded up to 16; auto-discovery of available patches from Riot/Coachless APIs would streamline maintenance.
