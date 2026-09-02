# Tech Context: Zinkoachless

## Tech Stack & Tooling

### Python Data Pipeline
- **Runtime:** Python 3.x
- **Environment Management:** `uv` (`source .venv/bin/activate` or `uv venv`)
- **Core Libraries:**
  - `requests`: Network requests to Coachless REST API (using persistent `Session` HTTP Keep-Alive).
  - `concurrent.futures.ThreadPoolExecutor`: High-concurrency async parallel fetching for patches and item details (10 worker pool).
  - `json`, `os`, `time`, `csv`: Built-in utilities for I/O and caching.
  - `pandas` (optional): Dataframe processing for CSV exports.

### Frontend Web Stack
- **Architecture:** Single-Page Application (SPA), static asset deployment (GitHub Pages compatible).
- **Languages:** HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3.
- **Design System:** Sleek minimalist dark mode aesthetic with custom Glassmorphism effects, flexbox/grid layouts, and responsive CSS variables.
- **Assets CDN:** Riot Games Data Dragon (`https://ddragon.leagueoflegends.com/cdn/{ddragon_version}/img/...`).

---

## API & Network Contracts

### Coachless REST Endpoints
- Protocol: `POST` with `Content-Type: application/json`
- Base URL: `https://api.coachless.gg`
- Endpoints:
  - `/api/Rune/GetKeystoneData`
  - `/api/ChampionWinprob/GetGlobalSummonerSpellStatistics`
  - `/api/ChampionWinprob/GetGlobalItemStatistics`
  - `/api/ChampionWinprob/GetItemDetailed`
  - `/api/ChampionWinprob/GetItemUsers`

### Payload Filters Standard (`commonFilters`)
```json
{
  "commonFilters": {
    "patch": { "major": 16, "patch": 1, "patchAdditions": 0 },
    "championIds": [236],
    "matchupChampionIds": null,
    "leagueTiers": [5, 6, 7],
    "regions": null,
    "role": 3
  }
}
```

#### Coachless API Role Mapping:
- **`role: 1`** $\to$ **Jungla (Jungle)**
- **`role: 2`** $\to$ **Carril Central (Mid)**
- **`role: 3`** $\to$ **Tirador / ADC (Bot)**
- **`role: 4`** $\to$ **Soporte (Support)**
- **`role: 5`** $\to$ **Carril Superior (Top)**

---

## Constraints & Rules
1. **Python Environment Rule:** Always execute python scripts using the virtualenv managed by `uv` (`source .venv/bin/activate`).
2. **No Git Execution Rule:** Do not execute `git` commands directly via shell tools; provide exact console instructions for the user if needed.
3. **No Realtime Web Browser Rule:** Web application testing should be done statically without real-time browser preview loops.
