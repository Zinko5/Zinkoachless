# Active Context: Zinkoachless

## Current State & Focus
- **Full Multi-Entity DDragon Patch Tracker:** [`patch_history.py`](file:///home/zinko/publico/zinkoachless/patch_history.py) diffs items, runes (`runesReforged.json`), and summoner spells (`summoner.json`) across 17 parches.
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
- **League of Legends Item Set Exporter (Botón Dividido y Exportación Masiva):**
  - Botón dividido (split button) en cabecera con botón principal "Exportar Set" y flecha mini para opciones adicionales.
  - Exportación individual: copia el set del campeón y rol actual al portapapeles o permite descargarlo en archivo `.json`.
  - Exportación masiva (Bulk): procesa todos los campeones y roles configurados en `championRolesMap` y consolida los sets en una sola estructura oficial de Riot Games (`{ "itemSets": [ ... ] }`), ordenados estrictamente en orden alfabético por campeón (A-Z) y por posición canónica (Top -> Jungla -> Mid -> Bot/ADC -> Support).
  - Permite copiar todos los sets al portapapeles o descargar `Zinkoachless_All_Item_Sets.json` para importar en un solo paso en el cliente de League of Legends (Colección > Objetos > Importar).
  - Incluye bloque especial "Todos por WPA" con todos los objetos de WPA positivo.

---

## Active Decisions & Workflows
- **Default Page Configuration:**
  - Default patch range: `16.1` to `16.17` (Full Season).
  - Default filter state: `⚡ Post-Ajuste` checked by default.
  - Default sort order: `⭐ Recomendado (Smart Rank)`.
  - Default champion: Akali (ID: 84, Top) por orden alfabético inicial.
- **Champion Scalability Workflow:**
  1. Add Champion ID and role (0: Top, 1: Jungle, 2: Mid, 3: Bot, 4: Support) to `CHAMPIONS` list in [`get-wpa.py`](file:///home/zinko/publico/zinkoachless/get-wpa.py).
  2. Map champion name and supported roles in `championNames` and `championRolesMap` in [`docs/app.js`](file:///home/zinko/publico/zinkoachless/docs/app.js).
  3. Add `<option>` with unique champion name to `#champion-select` in [`docs/index.html`](file:///home/zinko/publico/zinkoachless/docs/index.html).
  4. Run `source .venv/bin/activate && python3 patch_history.py && python3 get-wpa.py && python3 process_wpa.py`.
- **Supported Champions:** Lucian, Smolder, Ekko, Gwen, Volibear, Annie, Warwick, Fiddlesticks, Viego, Samira, Briar, Shaco, Graves, Akali, Lux, Garen, Dr. Mundo, Seraphine, Fizz, Zilean, Nilah, Neeko, Evelynn, Veigar, Brand, Tahm Kench, Teemo, Tryndamere, Vladimir, Swain, Draven, Tristana, Jinx

---

## Next Steps
- Add more ADC, midlane, and jungle champions (e.g. Ezreal ID: 81, Kai'Sa ID: 145, Lee Sin ID: 64).
- Create automated CI/Cron runner to execute updates whenever Riot releases a new patch.
