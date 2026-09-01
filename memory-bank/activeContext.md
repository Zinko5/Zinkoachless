# Active Context: Zinkoachless

## Current State & Focus
- **Memory Bank Initialized:** Full architectural and contextual documentation established in `memory-bank/`.
- **Pipeline Operation:** `get-wpa.py` downloads and caches patch data for Lucian (236, Bot), Smolder (901, Bot), and Ekko (245, Jungla).
- **Data Processor:** `process_wpa.py` transforms raw JSON files into structured records, fetches live item/rune metadata from DDragon, and writes `docs/data.js`.
- **Web Interface:** Dashboard fully responsive with dark mode design system, champion switching, patch range sliders, and dynamic column sorting.

---

## Active Decisions & Workflows
- **Patch Caching Strategy:**
  - Historical patches (e.g. 16.1..16.15) are cached in `data/raw/` and skipped on subsequent runs.
  - The latest patch in `PATCHES` array is always fetched fresh to catch daily metadata updates.
- **Champion Scalability Workflow:**
  1. Add Champion ID to `CHAMPIONS` list in `get-wpa.py`.
  2. Add name/role to `championNames` and `championRoles` in `docs/app.js`.
  3. Add `<option>` to `#champion-select` in `docs/index.html`.
  4. Run `python3 get-wpa.py && python3 process_wpa.py`.

---

## Next Steps
- Expand support for additional champions (e.g., Ezreal ID: 81, Kai'Sa ID: 145).
- Integrate `GetItemDetailed` payload for deeper item metrics (damage type splits, matchup sinergies) in an item detail popup modal.
- Create automated cron/CI script for periodic dataset updates when new Riot patches launch.
