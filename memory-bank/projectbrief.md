# Project Brief: Zinkoachless ⚡

**Zinkoachless** is a dynamic multi-patch Win Probability Added (WPA) aggregator and visualizer for League of Legends (LoL). It extracts, normalizes, and consolidates item, rune, and summoner spell statistics across multiple game patches to reveal viable off-meta builds and hidden competitive strategies.

---

## Core Goals
1. **Bypass Commercial Paywalls:** Provide multi-patch aggregation capabilities for free without relying on paid Coachless Premium subscriptions.
2. **Solve Sample Size Limitations:** Aggregate item purchase and rune pick counts across consecutive patches to ensure statistical confidence ($N_{\text{total}} \ge \text{Threshold}$) for low-sample off-meta picks.
3. **Provide Offline & Fast Visualizations:** Generate static data payloads (`docs/data.js`) to render an ultra-responsive, zero-latency single-page web app (SPA) capable of running 100% offline.
4. **Automate Data Pipeline:** Maintain an intelligent caching system that skips static historical patches while updating the latest active patch dynamically.

---

## Scope & Target Audience
- **Target Audience:** Theorycrafters, LoL analysts, competitive players, and software engineers looking for data-driven build optimization.
- **Supported Champions:** Multi-champion architecture starting with Lucian (ID: 236) and Smolder (ID: 901), easily extensible to any League champion.
- **Key Modules:**
  - `get-wpa.py`: Intelligent extraction and raw caching pipeline.
  - `process_wpa.py`: Data transformation, weighted average computation, and DDragon metadata mapping.
  - `docs/`: Web frontend (SPA) built with Vanilla HTML5, Vanilla CSS3, and modern ES6+ JavaScript.
