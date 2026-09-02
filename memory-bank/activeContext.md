# Active Context: Zinkoachless

## Current State & Focus
- **Full Multi-Entity DDragon Patch Tracker:** [`patch_history.py`](file:///home/zinko/publico/zinkoachless/patch_history.py) diffs items, runes (`runesReforged.json`), and summoner spells (`summoner.json`) across 17 parches.
- **Time-Decay Exponential Weighting ($\lambda = 0.75$):** Aggregates WPA with a 2.4-patch half-life, ensuring recent patch performance dominates while preserving historical depth.
- **Smart Composite Ranking (`smart_rank`):** Default sorting algorithm combining recency-weighted WPA and log-sample confidence.
- **Statistical Role Badges & Compact UX:**
  - `⭐ Meta`: High volume + solid positive WPA.
  - `🎯 Situacional / Hidden OP`: High-efficiency niche pick / secret OP choice.
  - `📈 Emergente`: Rising recent WPA momentum ($\Delta \text{WPA} > 0$).
  - `⚡ Ajustado`: Indicates latest patch change.
  - Strict Negative-WPA Exclusion: Items with $WPA < 0$ are never labeled Meta (eliminating popularity traps).
- **Dynamic Market Share Sample Filtering:**
  - Mode 1: `⭐ Populares & Solidez` filters out items below $0.5\%$ of total category purchase volume.
  - Mode 2: `📚 Catálogo Completo (Incluye Nicho / OTP)` shows 100% of recorded items.
- **League of Legends Item Set Exporter:**
  - Copies JSON payload directly to clipboard (`navigator.clipboard.writeText`).
  - Includes custom `"Todos por WPA"` block at the end with all positive WPA items unfiltered.

---

## Active Decisions & Workflows
- **Default Page Configuration:**
  - Default patch range: `16.1` to `16.17` (Full Season).
  - Default filter state: `⚡ Post-Ajuste` checked by default.
  - Default sort order: `⭐ Recomendado (Smart Rank)`.
- **Champion Scalability Workflow:**
  1. Add Champion ID to `CHAMPIONS` list in [`get-wpa.py`](file:///home/zinko/publico/zinkoachless/get-wpa.py).
  2. Add name/role to `championNames` and `championRoles` in [`docs/app.js`](file:///home/zinko/publico/zinkoachless/docs/app.js).
  3. Add `<option>` to `#champion-select` in [`docs/index.html`](file:///home/zinko/publico/zinkoachless/docs/index.html).
  4. Run `source .venv/bin/activate && python3 patch_history.py && python3 get-wpa.py && python3 process_wpa.py`.

---

## Next Steps
- Add more ADC, midlane, and jungle champions (e.g. Ezreal ID: 81, Kai'Sa ID: 145, Lee Sin ID: 64).
- Create automated CI/Cron runner to execute updates whenever Riot releases a new patch.
