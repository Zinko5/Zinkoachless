# Project Progress & Roadmap

## What Works 
- [x] **Data Scraping (`get-wpa.py`):**
  - POST requests to Coachless API endpoints.
  - Multi-patch range iteration (Patches 16.1 to 16.16).
  - Intelligent patch caching system.
  - Exception handling with exponential retries (`safe_fetch`).
  - **Parámetros CLI y Salto Instantáneo (0s):** Flags `--skip-existing` (`-s`) y `--exclude-latest` (`-e`) para omitir instantáneamente campeones completados sin gastar cuota de API ni verificar actualizaciones redundantes.
- [x] **Data Transformation (`process_wpa.py`):**
  - Multi-category normalization (8 sections: Keystones, Spells, Starters, Boots, 1st, 2nd, 3rd, 4th+ items).
  - Recency-weighted WPA calculation ($\lambda = 0.75$, half-life $\approx 2.4$ patches).
  - Dynamic Riot Games DDragon CDN integration for icons & localized names.
  - Automatic export to CSV (`data/processed/`) and compact on-demand JSONs (`docs/data/granular/`).
- [x] **Multi-Entity Patch History Tracker (`patch_history.py`):**
  - Download & local cache of `item.json`, `runesReforged.json`, and `summoner.json` per patch from DDragon CDN.
  - Automated diffing of cost, stats, descriptions, and rune attributes across consecutive patches (978 entities tracked).
  - Export to `data/processed/item_patch_history.json`.
- [x] **Web Dashboard (`docs/`):**
  - Vanilla JS SPA with zero runtime dependencies.
  - **Ultra-fast Lazy Loading:** Replaced 78MB monolithic bundle with instantaneous on-demand fetching per champion.
  - Real-time client-side patch range filtering (From Patch 16.1 / To Patch 16.16).
  - **"Filtrar Post-Ajuste (⚡)"** checked by default: excludes pre-adjustment patches per item/rune to evaluate strictly post-change WPA.
  - **Ordenamiento por defecto:** `WPA General` (conmutable a Smart Rank o Popularidad).
  - **Statistical Role Badges & Compact UX:** `⭐ Meta`, `🎯 Situacional / Hidden OP`, `📈 Emergente`, `⚡ Ajustado`.
  - **Dynamic Market Share Filter:** Mode 1 (`⭐ Populares & Solidez` - $0.5\%$ category sample cutoff) vs Mode 2 (`📚 Catálogo Completo` - 100% un-filtered).
  - **LoL Item Set Exporter:** Botón dividido (split button) con exportación individual (portapapeles y archivo .json) y **Modal Interactivo de Selección Múltiple** para personalizar qué campeones y roles incluir. Exportación accionable en 6 bloques: Básicos, Primer item, Segundo item, Tercer item, Items por WPA y Todos (catálogo completo positivo).
  - Dynamic champion selector con buscador integrado, **filtro rápido por rol/carril** (Todos, Top, Jungla, Mid, Bot, Support) e insignias de posiciones compatibles.
  - **Soporte Multilingüe Dinámico (i18n ES / EN):** Español de Latinoamérica (`es_MX`) por defecto en interfaz, objetos, runas y hechizos; alternador instantáneo `ES` / `EN` en la cabecera con persistencia y búsqueda universal bilingüe.
  - **Visualización Dinámica de Nombres:** Al pasar el cursor (hover en escritorio) o tocar el nombre del ítem (tap en móvil), se ocultan las insignias para mostrar el nombre completo sin cortes ni puntos suspensivos; tocar fuera restaura las insignias.
  - Dark mode aesthetic with glassmorphic cards and crisp layout.
- [x] **Configuración Centralizada & Pipeline Maestro (`config.json` & `pipeline.py`):**
  - Archivo único `config.json` como *Single Source of Truth* para temporadas, parches, campeones y roles.
  - Script maestro `pipeline.py` que orquesta la ejecución secuencial completa con un solo comando.
  - Sincronización automática con `docs/data/config.json` para poblar dinámicamente la web sin tocar HTML/JS.
- [x] **Memory Bank:**
  - Standard Memory Bank system fully maintained (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`).

---

## What's Left to Build ⌛
- [ ] Add more ADC, midlane, and jungle champions to `config.json`.
- [ ] Create automated daily/weekly patch check runner.

---

## Known Issues & Technical Debts
- **Automated Patch Auto-Discovery:** Option to automatically append newly released patches to `config.json` by pinging Riot API.
