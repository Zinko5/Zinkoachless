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
- **Filtro Rápido por Rol en Selector de Campeones (Champ Select UX):**
  - Barra de filtro por posición (Todos, Top, Jungla, Mid, Bot, Support) integrada en el dropdown de selección de campeón justo debajo de la barra de búsqueda.
  - Por defecto inicia siempre en "Todos" (catálogo completo sin filtro).
  - Filtrado instantáneo por posición para encontrar rápidamente opciones offmeta en la fase de selección.
  - Indicadores visuales de roles soportados a la derecha de cada campeón en la lista y pre-selección automática del rol filtrado al hacer clic.
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
  - Default sort order: `WPA General` (con soporte para Smart Rank y Popularidad).
  - Default champion: Primer campeón en orden alfabético según el catálogo configurado (dinámico en carga).
- **Champion Scalability Workflow (Centralized via config.json):**
  1. Add Champion ID, name, and roles (0: Top, 1: Jungle, 2: Mid, 3: Bot, 4: Support) to `"champions"` list in [`config.json`](file:///home/zinko/publico/zinkoachless/config.json).
  2. Run `source .venv/bin/activate && python3 pipeline.py`.
  3. The website and all components update automatically without touching HTML or JS.
- **Rigor Multiparche en 9 Categorías Principales:** Todo el pipeline extrae y consolida datos históricos en los 17 parches completos con ponderación temporal $\lambda = 0.75$. Se deprecó `GetItemDetailed` al comprobar empíricamente que sus métricas situacionales sólo reordenaban los mismos ítems con WPA positivo general, reduciendo la carga de red en un 90% (de ~1,360 a 153 peticiones por campeón) y previniendo los límites de tasa (HTTP 429).
- **Modos de Ejecución CLI y Salto Instantáneo (0s) en Pipeline:**
  - `python3 pipeline.py`: Modo normal con actualización del último parche activo para todos los campeones.
  - `python3 pipeline.py -s` o `--skip-existing` (`--no-update`): Omite en 0 segundos cualquier campeón que ya tenga todos los parches descargados localmente, sin hacer peticiones redundantes ni gastar cuota de API.
  - `python3 pipeline.py -e` o `--exclude-latest`: Omitir el último parche de `config.json` (descargando solo hasta el penúltimo) y saltar en 0 segundos todos los campeones ya guardados.
  - Verificación atómica previa: antes de entrar a consultar categorías en Coachless, el script determina qué parches faltan y, si no falta ninguno, avanza de inmediato sin esperar ni consumir cuota horaria.
- **Exportador LoL Compacto en 6 Bloques:** Estructura limpia y accionable: Básicos, Primer item, Segundo item, Tercer item, Items por WPA (filtrados por cuota de mercado) y **Todos** (catálogo completo no filtrado con $WPA > 0$ y muestra $\ge 50$).
- **Optimización y Limpieza de Datos:** Eliminación de campos obsoletos `details` en `docs/data/granular/` (ahorro de ~18 MB en Git) y de `item_details` en `data/raw/` (ahorro de ~8 MB en disco local).
- **Corrección de Ícono de Navaja de la Tormenta (Stormrazor):** Mapeo de alias en `docs/app.js` (`3097 -> 3095`) para cargar directamente el sprite válido de DDragon 16.19.1 evitando 404 y fallback a botas marrones.
- **Soporte Completo de Evoluciones de Ítem de Support (1st Item):** Coachless requiere el parámetro `includeSupportItems: True` en peticiones de `role: 4` para entregar las evoluciones de misión (Oposición Celestial 3869, Trineo del Solsticio 3876, Perforatrastos de Zaz'Zak 3871, Creador de Sueños 3870, Canción de Sangre 3877). En `get-wpa.py` se implementó auto-detección y recuperación específica para rellenar `item_slot_1` en perfiles de soporte locales ya cacheados.

---

## Next Steps
- Ejecutar extracción de `item_slot_1` para soportes una vez finalizado el cooldown de cuota o tras alternar servidor en Proton VPN.
- Ejecutar `process_wpa.py` para regenerar `docs/data/granular/` con las evoluciones de soporte completas.
- Crear runner CI/Cron automatizado para ejecutar `pipeline.py` cuando Riot lance un nuevo parche.
