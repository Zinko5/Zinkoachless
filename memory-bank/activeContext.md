# Active Context: Zinkoachless

## Current State & Focus
- **Full Multi-Entity DDragon Patch Tracker:** [`patch_history.py`](file:///home/zinko/publico/zinkoachless/patch_history.py) diffs items, runes (`runesReforged.json`), and summoner spells (`summoner.json`) across 17 parches.
- **Lazy Loading & Payload Optimization:** Replaced monolithic 78MB `docs/data.js` bundle with on-demand compact JSON loading (`docs/data/granular/`), cutting initial load transfer by 99.9% (<150KB total) and eliminating Git file size warnings.
- **In-Memory Caching & Single DDragon Init:** `docs/app.js` caches loaded champion files in `championDataCache` and fetches DDragon version/rune catalogs only once at initialization.
- **Documentation Upgrade:** Completely updated [`README.md`](file:///home/zinko/publico/zinkoachless/README.md) with accurate paths, math formulas, clean formatting without emoji excess, complete script pipeline guide, environment setup with `uv`, and champion addition instructions.
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
- **League of Legends Item Set Exporter (Botón Dividido y Modal de Selección Personalizable):**
  - Botón dividido (split button) en cabecera con botón principal "Exportar Set" y flecha mini para opciones adicionales.
  - Exportación individual: copia el set del campeón y rol actual al portapapeles o permite descargarlo en archivo `.json`.
  - **Modal Interactivo de Selección Múltiple:** Permite filtrar y seleccionar qué campeones y roles incluir antes de exportar, con buscador en vivo, botones rápidos ("Todos", "Ninguno", "Solo Actual"), resumen dinámico de sets y opciones para copiar al portapapeles o descargar `Zinkoachless_Custom_Item_Sets.json`.
  - Orden canónico por campeón (A-Z) y por posición (Top -> Jungla -> Mid -> Bot/ADC -> Support).
- **Sistema de Internacionalización Dinámica (i18n):**
  - Español Latinoamericano (`es_MX` - LAS/LAN) por defecto para interfaz, objetos, runas y hechizos.
  - Selector de idioma (`ES` / `EN`) en la cabecera superior con persistencia en `localStorage`.
  - Descarga y caché en memoria de catálogos duales de DDragon (`es_MX` y `en_US`) para conmutación instantánea (0 ms) sin recargar la página.
  - Búsqueda multilingüe en tiempo real y exportación de sets de objetos localizada.

---

## Active Decisions & Workflows
- **Default Page Configuration:**
  - Default patch range: `16.1` to `16.17` (Full Season).
  - Default filter state: `⚡ Post-Ajuste` checked by default.
  - Default sort order: `⭐ Recomendado (Smart Rank)`.
  - Default champion: Akali (ID: 84, Top) por orden alfabético inicial.
- **Champion Scalability Workflow (Centralized via config.json):**
  1. Add Champion ID, name, and roles (0: Top, 1: Jungle, 2: Mid, 3: Bot, 4: Support) to `"champions"` list in [`config.json`](file:///home/zinko/publico/zinkoachless/config.json).
  2. Run `source .venv/bin/activate && python3 pipeline.py`.
  3. The website and all components update automatically without touching HTML or JS.
- **Supported Champions (33):** Lucian, Smolder, Ekko, Gwen, Volibear, Annie, Warwick, Fiddlesticks, Viego, Samira, Briar, Shaco, Graves, Akali, Lux, Garen, Dr. Mundo, Seraphine, Fizz, Zilean, Nilah, Neeko, Evelynn, Veigar, Brand, Tahm Kench, Teemo, Tryndamere, Vladimir, Swain, Draven, Tristana, Jinx

---

## Next Steps
- Add more ADC, midlane, and jungle champions (e.g. Ezreal ID: 81, Kai'Sa ID: 145, Lee Sin ID: 64) via `config.json`.
- Create automated CI/Cron runner to execute `pipeline.py` whenever Riot releases a new patch.
