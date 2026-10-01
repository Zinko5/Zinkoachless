// Diccionarios de mappings específicos para iconos de Riot DDragon
const spellImages = {
  1: "SummonerBoost.png",
  3: "SummonerExhaust.png",
  4: "SummonerFlash.png",
  6: "SummonerHaste.png",
  7: "SummonerHeal.png",
  8: "SummonerSmite.png",
  9: "SummonerTeleport.png",
  10: "SummonerDot.png",
  21: "SummonerBarrier.png"
};

const runeImages = {
  8369: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png",
  8010: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Conqueror/Conqueror.png",
  8021: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png",
  8005: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png",
  8008: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png",
  8128: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png",
  8112: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png"
};

// Idioma actual (por defecto español latinoamericano)
let currentLang = localStorage.getItem("zinkoachless_lang") || "es";

// Catálogos multilingües de DDragon (en memoria para cambio instantáneo)
const ddragonCatalogs = {
  es: { items: {}, runes: {}, spells: {} },
  en: { items: {}, runes: {}, spells: {} }
};

const legacyNames = {
  es: { 3097: "Navaja de la Tormenta" },
  en: { 3097: "Stormrazor" }
};

// Diccionario de internacionalización (i18n)
const i18n = {
  es: {
    title: "Zinkoachless",
    searchChampion: "Buscar campeón...",
    roleNames: {
      0: "Superior (Top)",
      1: "Jungla",
      2: "Carril Central (Mid)",
      3: "Tirador / ADC (Bot)",
      4: "Soporte (Support)"
    },
    roleShort: { 0: "Top", 1: "Jungla", 2: "Mid", 3: "Bot", 4: "Support" },
    btnGlobal: "Populares & Solidez",
    btnGlobalTitle: "Vista Filtrada: Muestra solo opciones relevantes con suficiente muestra (evita ruido y picks hiper-raros)",
    btnAllItems: "Catálogo Completo",
    btnAllItemsTitle: "Vista Completa: Muestra el catálogo 100% entero de opciones, incluyendo picks de nicho u OTP",
    btnFilters: "Filtros",
    btnExportSet: "Exportar Set",
    btnExportSetTitle: "Copiar set actual al portapapeles",
    exportDropdownTitle: "Exportación de Sets",
    exportBulkTitle: "Personalizar y exportar varios...",
    exportBulkSub: "Elige los campeones y roles deseados",
    exportCurrentTitle: "Campeón Actual",
    exportCurrentCopy: "Copiar set actual",
    exportCurrentCopySub: "Portapapeles (campeón y rol actual)",
    exportCurrentDownload: "Descargar set actual (.json)",
    exportCurrentDownloadSub: "Archivo listo para importar",
    tabBuilds: "Vista por Slots (Builds)",
    tabItems: "Catálogo General (Items)",
    searchPlaceholder: "Buscar runas, hechizos, objetos...",
    patchFrom: "Desde:",
    patchTo: "Hasta:",
    wpaFiltersTitle: "Filtrar por WPA (Soporta selección múltiple):",
    wpaPosGen: "WPA General Positivo (+)",
    wpaNegGen: "WPA General Negativo (-)",
    wpaPostAdj: "⚡ Filtrar Post-Ajuste (Solo parches tras último cambio)",
    wpaTrendingUp: "📈 Alternativas Emergentes (Trending Up)",
    wpaMagic: "Positivo: Daño Mágico",
    wpaPhysical: "Positivo: Daño Físico",
    wpaTanky: "Positivo: Tanques",
    wpaSquishy: "Positivo: Blandos (Squishy)",
    wpaHighCC: "Positivo: Alto CC",
    wpaGoldAhead: "Positivo: Ventaja Oro",
    wpaGoldBehind: "Positivo: Desventaja Oro",
    sortBy: "Ordenar por:",
    sortSmartRank: "⭐ Recomendado (Smart Rank)",
    sortWpa: "WPA General",
    sortSample: "Popularidad (Compras)",
    sortMagic: "Daño Mágico Enemigo",
    sortPhysical: "Daño Físico Enemigo",
    sortTanky: "Tanques Enemigos",
    sortSquishy: "Campeones Blandos (Squishy)",
    sortHighCC: "Alto CC Enemigo",
    sortGoldAhead: "Ventaja de Oro",
    sortGoldBehind: "Desventaja de Oro",
    sortOrder: "Orden:",
    sortDesc: "Descendente",
    sortAsc: "Ascendente",
    overviewTitle: "Agregación Multiparche WPA",
    badgeMetaText: "Meta",
    badgeMetaTitle: "⭐ Meta: Elección estándar de alto volumen y rendimiento sólido",
    badgeSituationalText: "Situacional / Hidden OP",
    badgeSituationalTitle: "🎯 Situacional / Hidden OP: Alta efectividad en situaciones específicas o gema oculta (Counter-pick / Secret Meta)",
    badgeTrendingText: "Emergente",
    badgeTrendingTitle: "📈 Alternativa Emergente: En alza",
    badgeAdjustedText: "Ajustado",
    badgeAdjustedTitle: "⚡ Ajustado: Último cambio en parche",
    patchTagPrefix: "Parches:",
    patchTagComplete: "(Completo)",
    loading: "Cargando...",
    noData: "Sin datos",
    noResults: "Sin resultados",
    // Categories
    catKeystone: "Keystone",
    catStarter: "Starter",
    cat1stItem: "1st Item",
    cat2ndItem: "2nd Item",
    catSpell: "Spell",
    catBoots: "Boots",
    cat3rdItem: "3rd Item",
    cat4thItem: "4th+ Item",
    catAllItems: "Todos los Objetos (Sin orden de compra)",
    sortTriggerWpa: "▼ WPA",
    sortTriggerPicks: "Picks",
    sortTriggerBuys: "Compras",
    // Modal
    modalTitle: "Exportar Sets de Objetos",
    modalSub: "Selecciona los campeones que deseas incluir en el paquete de importación de LoL.",
    modalSearchPlaceholder: "Buscar campeón...",
    modalBtnAll: "Todos",
    modalBtnNone: "Ninguno",
    modalBtnCurrent: "Solo Actual",
    modalSelectionSummary: (selected, sets) => `${selected} campeón(es) seleccionado(s) — ${sets} set(s) en total`,
    modalCancel: "Cancelar",
    modalCopy: "Copiar al Portapapeles",
    modalDownload: "Descargar .json",
    modalProcessing: "Procesando...",
    modalGenerating: (completed, total) => `Generando (${completed}/${total})...`,
    // Detail panels
    dmgTitle: "Por Daño Enemigo",
    rangeTitle: "Por Rango Enemigo",
    tankinessTitle: "Por Aguante Enemigo",
    ccTitle: "Por Control de Masas (CC)",
    goldTitle: "Por Diferencia de Oro",
    metricPhysical: "Físico",
    metricMagic: "Mágico",
    metricBalanced: "Balanceado",
    metricHighRange: "Alto Rango",
    metricLowRange: "Bajo Rango",
    metricTanky: "Tanques",
    metricSquishy: "Blandos (Squishy)",
    metricHighCC: "Alto CC",
    metricLowCC: "Bajo CC",
    metricNormalCC: "Normal CC",
    metricGoldAhead: "Con Ventaja",
    metricGoldBehind: "Con Desventaja",
    metricGoldBalanced: "Partida Pareja",
    advancedPerfTitle: "Rendimiento Avanzado (WPA Added)",
    // Set export blocks
    blockBasics: "Básicos",
    block1st: "Primer item",
    block2nd: "Segundo item",
    block3rd: "Tercer item",
    blockItemsWpa: "Items por WPA",
    blockVsMagic: "Vs. Daño Mágico",
    blockVsPhysical: "Vs. Daño Físico",
    blockVsTanky: "Vs. Tanques",
    blockVsSquishy: "Vs. Blandos (Squishy)",
    blockVsHighCC: "Vs. Alto CC",
    blockGoldAhead: "Con Ventaja (Ahead)",
    blockGoldBehind: "Con Desventaja (Behind)",
    blockAll: "Todos",
    blockAllWpa: "Todos por WPA"
  },
  en: {
    title: "Zinkoachless",
    searchChampion: "Search champion...",
    roleNames: {
      0: "Top",
      1: "Jungle",
      2: "Middle",
      3: "Bottom (ADC)",
      4: "Support"
    },
    roleShort: { 0: "Top", 1: "Jungle", 2: "Mid", 3: "Bot", 4: "Support" },
    btnGlobal: "Popular & Solid",
    btnGlobalTitle: "Filtered View: Shows relevant choices with sufficient sample size (avoids niche noise)",
    btnAllItems: "Full Catalog",
    btnAllItemsTitle: "Full View: Shows 100% complete catalog including niche and OTP picks",
    btnFilters: "Filters",
    btnExportSet: "Export Set",
    btnExportSetTitle: "Copy current set to clipboard",
    exportDropdownTitle: "Item Set Export",
    exportBulkTitle: "Customize & bulk export...",
    exportBulkSub: "Choose desired champions and roles",
    exportCurrentTitle: "Current Champion",
    exportCurrentCopy: "Copy current set",
    exportCurrentCopySub: "Clipboard (current champion & role)",
    exportCurrentDownload: "Download current set (.json)",
    exportCurrentDownloadSub: "Ready-to-import file",
    tabBuilds: "Slot View (Builds)",
    tabItems: "General Catalog (Items)",
    searchPlaceholder: "Search runes, spells, items...",
    patchFrom: "From:",
    patchTo: "To:",
    wpaFiltersTitle: "Filter by WPA (Supports multi-select):",
    wpaPosGen: "Positive General WPA (+)",
    wpaNegGen: "Negative General WPA (-)",
    wpaPostAdj: "⚡ Filter Post-Adjustment (Only patches after last change)",
    wpaTrendingUp: "📈 Rising Alternatives (Trending Up)",
    wpaMagic: "Positive: Magic Damage",
    wpaPhysical: "Positive: Physical Damage",
    wpaTanky: "Positive: Tanks",
    wpaSquishy: "Positive: Squishy",
    wpaHighCC: "Positive: High CC",
    wpaGoldAhead: "Positive: Gold Lead",
    wpaGoldBehind: "Positive: Gold Deficit",
    sortBy: "Sort By:",
    sortSmartRank: "⭐ Recommended (Smart Rank)",
    sortWpa: "General WPA",
    sortSample: "Popularity (Buys)",
    sortMagic: "Enemy Magic Damage",
    sortPhysical: "Enemy Physical Damage",
    sortTanky: "Enemy Tanks",
    sortSquishy: "Squishy Champions",
    sortHighCC: "Enemy High CC",
    sortGoldAhead: "Gold Lead",
    sortGoldBehind: "Gold Deficit",
    sortOrder: "Order:",
    sortDesc: "Descending",
    sortAsc: "Ascending",
    overviewTitle: "Multi-Patch WPA Aggregation",
    badgeMetaText: "Meta",
    badgeMetaTitle: "⭐ Meta: Standard high-volume, solid performance choice",
    badgeSituationalText: "Situational / Hidden OP",
    badgeSituationalTitle: "🎯 Situational / Hidden OP: High-efficiency niche pick or secret OP choice",
    badgeTrendingText: "Rising",
    badgeTrendingTitle: "📈 Rising Alternative: Trending up",
    badgeAdjustedText: "Adjusted",
    badgeAdjustedTitle: "⚡ Adjusted: Last change in patch",
    patchTagPrefix: "Patches:",
    patchTagComplete: "(Full)",
    loading: "Loading...",
    noData: "No data",
    noResults: "No results",
    // Categories
    catKeystone: "Keystone",
    catStarter: "Starter",
    cat1stItem: "1st Item",
    cat2ndItem: "2nd Item",
    catSpell: "Spell",
    catBoots: "Boots",
    cat3rdItem: "3rd Item",
    cat4thItem: "4th+ Item",
    catAllItems: "All Items (Unordered)",
    sortTriggerWpa: "▼ WPA",
    sortTriggerPicks: "Picks",
    sortTriggerBuys: "Buys",
    // Modal
    modalTitle: "Export Item Sets",
    modalSub: "Select the champions you want to include in the LoL client import package.",
    modalSearchPlaceholder: "Search champion...",
    modalBtnAll: "All",
    modalBtnNone: "None",
    modalBtnCurrent: "Current Only",
    modalSelectionSummary: (selected, sets) => `${selected} champion(s) selected — ${sets} total set(s)`,
    modalCancel: "Cancel",
    modalCopy: "Copy to Clipboard",
    modalDownload: "Download .json",
    modalProcessing: "Processing...",
    modalGenerating: (completed, total) => `Generating (${completed}/${total})...`,
    // Detail panels
    dmgTitle: "Enemy Damage Profile",
    rangeTitle: "Opponent Range",
    tankinessTitle: "Enemy Tankiness",
    ccTitle: "Crowd Control (CC)",
    goldTitle: "Game State (Gold)",
    metricPhysical: "Physical",
    metricMagic: "Magic",
    metricBalanced: "Balanced",
    metricHighRange: "High Range",
    metricLowRange: "Low Range",
    metricTanky: "Tanks",
    metricSquishy: "Squishy",
    metricHighCC: "High CC",
    metricLowCC: "Low CC",
    metricNormalCC: "Normal CC",
    metricGoldAhead: "Gold Lead",
    metricGoldBehind: "Gold Deficit",
    metricGoldBalanced: "Even Game",
    advancedPerfTitle: "Advanced Performance (WPA Added)",
    // Set export blocks
    blockBasics: "Starter & Core",
    block1st: "1st Item",
    block2nd: "2nd Item",
    block3rd: "3rd Item",
    blockItemsWpa: "Items by WPA",
    blockVsMagic: "Vs. Magic Damage",
    blockVsPhysical: "Vs. Physical Damage",
    blockVsTanky: "Vs. Tanks",
    blockVsSquishy: "Vs. Squishy",
    blockVsHighCC: "Vs. High CC",
    blockGoldAhead: "When Ahead",
    blockGoldBehind: "When Behind",
    blockAll: "All",
    blockAllWpa: "All Positive WPA Items"
  }
};

function t(key, ...args) {
  const dict = i18n[currentLang] || i18n.es;
  const val = dict[key];
  if (typeof val === "function") {
    return val(...args);
  }
  return val !== undefined ? val : (i18n.es[key] || key);
}

function getItemLocalizedName(item) {
  if (!item) return "";
  const lang = currentLang || "es";
  const id = Number(item.id);
  const cat = item.category;

  if (legacyNames[lang] && legacyNames[lang][id]) {
    return legacyNames[lang][id];
  }

  if (cat === "Keystone") {
    if (ddragonCatalogs[lang]?.runes[id]) return ddragonCatalogs[lang].runes[id];
  } else if (cat === "Spell") {
    if (ddragonCatalogs[lang]?.spells[id]) return ddragonCatalogs[lang].spells[id];
  } else {
    if (ddragonCatalogs[lang]?.items[id]) return ddragonCatalogs[lang].items[id];
  }
  return item.name || `ID_${item.id}`;
}

const roleLabelsShort = {
  0: "Top",
  1: "Jungla",
  2: "Mid",
  3: "Bot",
  4: "Support"
};

let latestVersion = "16.16.1";
let wpaData = []; // Esto guardará los registros granulares (por parche)
let currentView = "global"; // "global" o "all-items"
let currentSort = "wpa"; // "wpa", "smart_rank" o "sample_size"
let currentTab = "builds";    // "builds" o "items"
let availablePatches = [];

// Comparar versiones de parches de LoL de manera natural (ej: 16.2 < 16.10)
function comparePatches(a, b) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const pA = partsA[i] || 0;
    const pB = partsB[i] || 0;
    if (pA !== pB) return pA - pB;
  }
  return 0;
}

function populatePatchDropdowns() {
  // Obtener parches únicos de wpaData
  const patchesSet = new Set(wpaData.map(d => d.patch));
  availablePatches = Array.from(patchesSet).sort(comparePatches);

  const fromSelect = document.getElementById("patch-from");
  const toSelect = document.getElementById("patch-to");

  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  availablePatches.forEach((patch, idx) => {
    const optFrom = document.createElement("option");
    optFrom.value = patch;
    optFrom.innerText = patch;
    // Seleccionar por defecto el primer parche disponible (16.1)
    if (idx === 0) {
      optFrom.selected = true;
    }
    fromSelect.appendChild(optFrom);

    const optTo = document.createElement("option");
    optTo.value = patch;
    optTo.innerText = patch;
    // Seleccionamos el último por defecto en "To"
    if (idx === availablePatches.length - 1) {
      optTo.selected = true;
    }
    toSelect.appendChild(optTo);
  });
}

function onPatchChange(changedSelect) {
  const fromSelect = document.getElementById("patch-from");
  const toSelect = document.getElementById("patch-to");
  const fromVal = fromSelect.value;
  const toVal = toSelect.value;

  // Mantener rango coherente (from <= to)
  if (comparePatches(fromVal, toVal) > 0) {
    if (changedSelect === 'from') {
      toSelect.value = fromVal;
    } else {
      fromSelect.value = toVal;
    }
  }
  applyFilters();
}

function getImageUrl(item) {
  if (item.category === "Keystone") {
    return runeImages[item.id] || "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7202_Sorcery.png";
  }
  if (item.category === "Spell") {
    const file = spellImages[item.id] || "SummonerFlash.png";
    return `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${file}`;
  }
  // Objetos por defecto
  return `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${item.id}.png`;
}

function renderCategory(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  if (!items || items.length === 0) {
    container.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.875rem;">${t('noData')}</div>`;
    return;
  }

  // Ordenar por selección activa (Smart Rank, WPA, Compras) y orden (ascendente/descendente)
  const sortOrder = document.getElementById("sort-order") ? document.getElementById("sort-order").value : "desc";
  items.sort((a, b) => {
    let valA, valB;
    if (currentSort === 'sample_size') {
      valA = a.sample_size;
      valB = b.sample_size;
    } else if (currentSort === 'wpa') {
      valA = a.wpa;
      valB = b.wpa;
    } else {
      valA = a.smart_score !== undefined ? a.smart_score : a.wpa;
      valB = b.smart_score !== undefined ? b.smart_score : b.wpa;
    }
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  items.forEach(item => {
    const sign = item.wpa >= 0 ? "+" : "";
    const wpaClass = item.wpa >= 0 ? "wpa-positive" : "wpa-negative";
    const iconUrl = getImageUrl(item);
    const displayName = getItemLocalizedName(item);
    
    const row = document.createElement("div");
    row.className = "item-row";
    
    // Generar insignias compactas según el rol estadístico del elemento
    let roleBadgeHtml = "";
    if (item.is_meta) {
      roleBadgeHtml = `<span class="meta-badge" title="${t('badgeMetaTitle')}">⭐</span>`;
    } else if (item.is_situational) {
      roleBadgeHtml = `<span class="situational-badge" title="${t('badgeSituationalTitle')}">🎯</span>`;
    }

    const patchBadgeHtml = item.last_changed_patch ? `<span class="patch-badge" title="${t('badgeAdjustedTitle')} ${item.last_changed_patch}">${item.last_changed_patch}⚡</span>` : "";
    const trendingBadgeHtml = item.is_trending_up ? `<span class="trending-badge" title="${t('badgeTrendingTitle')} (+${item.delta_wpa.toFixed(2)}% WPA)">📈</span>` : "";
    
    row.innerHTML = `
      <div class="item-icon">
        <img src="${iconUrl}" alt="${displayName}" onerror="this.onerror=function(){this.onerror=null;this.src='https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/1001.png';}; this.src='https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${item.id}.png';">
      </div>
      <div class="item-details" style="display: flex; flex-direction: column; min-width: 0;">
        <div class="item-title-row">
          <span class="item-name-text" title="${displayName}">${displayName}</span>
          <div class="item-badges-wrapper">
            ${roleBadgeHtml}
            ${patchBadgeHtml}
            ${trendingBadgeHtml}
          </div>
        </div>
        <div class="item-subtext">ID: ${item.id}</div>
      </div>
      <div class="item-stats">
        <div class="wpa-value ${wpaClass}">${sign}${item.wpa.toFixed(2)}%</div>
        <div class="buys-count">${formatNumber(item.sample_size)}</div>
      </div>
    `;

    // Manejar toque en móvil para alternar nombre completo vs insignias
    const nameEl = row.querySelector(".item-name-text");
    if (nameEl) {
      nameEl.addEventListener("click", (e) => {
        const isCurrentActive = row.classList.contains("show-full-name");
        document.querySelectorAll(".item-row.show-full-name").forEach(r => r.classList.remove("show-full-name"));
        if (!isCurrentActive) {
          row.classList.add("show-full-name");
          e.stopPropagation();
        }
      });
    }

    container.appendChild(row);
  });
  lucide.createIcons();
}

function applyFilters() {
  const sortByEl = document.getElementById("sort-by");
  if (sortByEl && sortByEl.value) {
    currentSort = sortByEl.value;
  }

  const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();
  const fromSelect = document.getElementById("patch-from");
  const toSelect = document.getElementById("patch-to");
  const postAdjChecked = document.getElementById("wpa-post-adj") ? document.getElementById("wpa-post-adj").checked : false;
  const trendingUpChecked = document.getElementById("wpa-trending-up") ? document.getElementById("wpa-trending-up").checked : false;
  
  const startPatch = fromSelect.value || (availablePatches[0] || "16.1");
  const endPatch = toSelect.value || (availablePatches[availablePatches.length - 1] || "16.16");

  // Actualizar el badge del rango de parches activo en la interfaz
  const patchTag = document.getElementById("active-patch-tag");
  if (patchTag) {
    let suffix = "";
    if (postAdjChecked) suffix += ` [⚡ ${t('badgeAdjustedText')}]`;
    if (trendingUpChecked) suffix += ` [📈 ${t('badgeTrendingText')}]`;
    if (availablePatches.length > 0 && startPatch === availablePatches[0] && endPatch === availablePatches[availablePatches.length - 1]) {
      patchTag.innerText = `${t('patchTagPrefix')} ${startPatch} - ${endPatch} ${t('patchTagComplete')}${suffix}`;
    } else {
      patchTag.innerText = `${t('patchTagPrefix')} ${startPatch} - ${endPatch}${suffix}`;
    }
  }

  // 1. Filtrar registros por parches seleccionados (rango inclusive)
  const granularFiltered = wpaData.filter(d => {
    // Si la casilla Post-Ajuste está activada, ignorar parches anteriores al último cambio del objeto
    if (postAdjChecked && d.last_changed_patch) {
      if (comparePatches(d.patch, d.last_changed_patch) < 0) {
        return false;
      }
    }
    return comparePatches(d.patch, startPatch) >= 0 && comparePatches(d.patch, endPatch) <= 0;
  });

  // 2. Realizar agregación ponderada de WPA y suma de muestra en el cliente
  const aggregated = {};
  granularFiltered.forEach(r => {
    const key = `${r.category}_${r.id}`;
    if (!aggregated[key]) {
      aggregated[key] = {
        category: r.category,
        id: r.id,
        name: r.name,
        last_changed_patch: r.last_changed_patch,
        weighted_wpa_sum: 0,
        total_sample: 0,
        records: []
      };
    }
    aggregated[key].total_sample += r.sample_size;
    aggregated[key].weighted_wpa_sum += r.wpa * r.sample_size;
    aggregated[key].records.push(r);
  });

  // Convertir a lista y calcular promedios, Momentum Delta y Clasificación Estadística
  const aggregatedList = [];
  for (const key in aggregated) {
    const item = aggregated[key];
    if (item.total_sample > 0) {
      // Ordenar registros de este objeto por parche
      item.records.sort((a, b) => comparePatches(a.patch, b.patch));
      const latestRecord = item.records[item.records.length - 1];
      const maxPatchIdx = availablePatches.length > 0 ? (availablePatches.length - 1) : 15;
      
      // Ponderación por Reciencia Temporal (Time-Decay Exponential Weighting)
      // Calibración Óptima (lambda = 0.75, Half-Life de ~2.4 parches)
      const lambda = 0.75;
      let recencyWeightedWpaSum = 0;
      let recencyWeightedSampleSum = 0;
      
      item.records.forEach(r => {
        const patchIdx = availablePatches.indexOf(r.patch);
        const patchDist = patchIdx >= 0 ? (maxPatchIdx - patchIdx) : 0;
        const decayWeight = Math.pow(lambda, patchDist);
        const effectiveWeight = r.sample_size * decayWeight;
        
        recencyWeightedWpaSum += r.wpa * effectiveWeight;
        recencyWeightedSampleSum += effectiveWeight;
      });
      
      const overallWpa = recencyWeightedSampleSum > 0 ? (recencyWeightedWpaSum / recencyWeightedSampleSum) : (item.weighted_wpa_sum / item.total_sample);

      const historicalRecords = item.records.slice(0, -1);
      let historicalWpa = 0;
      let historicalSample = 0;
      historicalRecords.forEach(h => {
        historicalSample += h.sample_size;
        historicalWpa += h.wpa * h.sample_size;
      });
      historicalWpa = historicalSample > 0 ? (historicalWpa / historicalSample) : (latestRecord ? latestRecord.wpa : 0);
      
      const latestWpa = latestRecord ? latestRecord.wpa : 0;
      const deltaWpa = latestWpa - historicalWpa;
      
      // Tendencia y clasificación basada en WPA real ponderado por reciencia
      const isTrendingUp = deltaWpa >= 0.05 || (latestWpa > 0 && deltaWpa > 0);
      const isNerfed = (item.last_changed_patch === (availablePatches[availablePatches.length - 1] || "16.16")) && deltaWpa < -0.15;
      
      // Una opción NUNCA es Meta si su WPA ponderado por reciencia es negativo.
      const hasSolidWpa = overallWpa >= 0.15 && latestWpa > 0;
      const isMeta = hasSolidWpa && item.total_sample >= 3000 && !isNerfed;
      
      // Es Situacional si tiene WPA positivo pero menor muestra (< 3,000) o WPA moderado.
      const isSituational = !isMeta && overallWpa > 0 && item.total_sample < 3000 && !isNerfed;

      // Puntuación Inteligente (Smart Score): Pondera WPA por reciencia y logaritmo de muestra
      const confidenceMultiplier = 1 + 0.15 * Math.log10(Math.max(1, item.total_sample));
      const smartScore = (isNerfed ? latestWpa : overallWpa) * confidenceMultiplier;

      aggregatedList.push({
        category: item.category,
        id: item.id,
        name: item.name,
        last_changed_patch: item.last_changed_patch,
        wpa: overallWpa,
        sample_size: item.total_sample,
        latest_wpa: latestWpa,
        historical_wpa: historicalWpa,
        delta_wpa: deltaWpa,
        is_trending_up: isTrendingUp,
        is_meta: isMeta,
        is_situational: isSituational,
        is_nerfed: isNerfed,
        smart_score: smartScore
      });
    }
  }

  // Calcular la muestra total sumada por categoría para establecer la cuota de mercado mínima (Market Share >= 0.5%)
  const totalSampleByCategory = {};
  aggregatedList.forEach(item => {
    totalSampleByCategory[item.category] = (totalSampleByCategory[item.category] || 0) + item.sample_size;
  });

  // 3. Aplicar filtros de búsqueda y WPA sobre los agregados
  let filtered = aggregatedList.filter(item => {
    // Filtro de búsqueda (soporta nombres en idioma activo, nombre original en inglés o ID)
    if (searchQuery) {
      const locName = getItemLocalizedName(item).toLowerCase();
      const origName = (item.name || "").toLowerCase();
      const idStr = String(item.id);
      if (!locName.includes(searchQuery) && !origName.includes(searchQuery) && !idStr.includes(searchQuery)) {
        return false;
      }
    }

    // Filtro de Alternativas Emergentes
    if (trendingUpChecked && !item.is_trending_up) {
      return false;
    }

    // Filtros de WPA Generales
    const checkPosGen = document.getElementById("wpa-pos-gen").checked;
    const checkNegGen = document.getElementById("wpa-neg-gen").checked;
    if (checkPosGen && item.wpa < 0) return false;
    if (checkNegGen && item.wpa > 0) return false;

    // Filtro de cuota de mercado mínima (0.5% del volumen total de la categoría en vista Populares & Solidez)
    if (currentView === "global") {
      const totalCategoryVolume = totalSampleByCategory[item.category] || 1000;
      const minMarketShareSample = Math.max(50, Math.round(totalCategoryVolume * 0.005)); // 0.5% de la cuota total del slot
      if (item.sample_size < minMarketShareSample) {
        return false;
      }
    }

    return true;
  });

  // Renderizar categorías reales
  const categories = {
    "Keystone": "list-Keystone",
    "Starter": "list-Starter",
    "1st Item": "list-1st-Item",
    "2nd Item": "list-2nd-Item",
    "Spell": "list-Spell",
    "Boots": "list-Boots",
    "3rd Item": "list-3rd-Item",
    "4th+ Item": "list-4th-Item",
    "All Items": "list-All-Items"
  };

  for (const [catName, containerId] of Object.entries(categories)) {
    const items = filtered.filter(d => d.category === catName);
    renderCategory(containerId, items);
  }
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}

let appConfig = null;

const championNames = {
  84: "Akali", 1: "Annie", 63: "Brand", 233: "Briar", 36: "DrMundo", 119: "Draven", 245: "Ekko",
  28: "Evelynn", 9: "Fiddlesticks", 105: "Fizz", 86: "Garen", 104: "Graves", 887: "Gwen", 222: "Jinx",
  236: "Lucian", 99: "Lux", 518: "Neeko", 895: "Nilah", 360: "Samira", 147: "Seraphine", 35: "Shaco",
  901: "Smolder", 50: "Swain", 223: "TahmKench", 17: "Teemo", 18: "Tristana", 23: "Tryndamere",
  45: "Veigar", 234: "Viego", 8: "Vladimir", 106: "Volibear", 19: "Warwick", 26: "Zilean"
};

// Roles soportados por cada campeón (ID de rol de Coachless: 0: Top, 1: Jungle, 2: Mid, 3: Bot, 4: Support)
const championRolesMap = {
  84: [0, 2], 1: [2, 4], 63: [3, 4], 233: [1], 36: [0, 1], 119: [3], 245: [1, 2],
  28: [1], 9: [1], 105: [2], 86: [0], 104: [1], 887: [1, 2], 222: [3],
  236: [3], 99: [2, 3, 4], 518: [4], 895: [3], 360: [3], 147: [2, 3, 4], 35: [1],
  901: [3], 50: [3], 223: [0, 4], 17: [0], 18: [3], 23: [0],
  45: [2], 234: [1], 8: [2], 106: [0, 1], 19: [0, 1], 26: [4]
};

async function loadConfig() {
  if (appConfig) return appConfig;
  const paths = ["data/config.json", "../data/config.json"];
  for (const p of paths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        appConfig = await res.json();
        break;
      }
    } catch (e) {}
  }
  
  if (appConfig && appConfig.champions) {
    appConfig.champions.forEach(c => {
      championRolesMap[c.id] = c.roles || [0];
      if (c.name) {
        championNames[c.id] = c.name;
      }
    });
  }
  return appConfig;
}

const roleNames = {
  0: "Superior (Top)",
  1: "Jungla (Jungle)",
  2: "Central (Mid)",
  3: "Tirador / ADC (Bot)",
  4: "Soporte (Support)"
};

let selectedChamp = null;
let selectedRole = 0;

function updateRoleSelector() {
  const supportedRoles = (selectedChamp && championRolesMap[selectedChamp]) ? championRolesMap[selectedChamp] : [0];
  
  // Si el rol seleccionado actual no está entre los soportados del campeón, cambiar al primero disponible
  if (!supportedRoles.includes(selectedRole)) {
    selectedRole = supportedRoles[0];
  }

  const roleBtns = document.querySelectorAll("#role-selector .role-btn");
  roleBtns.forEach(btn => {
    const roleId = parseInt(btn.getAttribute("data-role"));
    if (supportedRoles.includes(roleId)) {
      btn.classList.remove("disabled");
      btn.removeAttribute("disabled");
      if (roleId === selectedRole) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    } else {
      btn.classList.add("disabled");
      btn.classList.remove("active");
      btn.setAttribute("disabled", "true");
    }
  });

  const roleLabel = document.getElementById("champion-role");
  if (roleLabel) {
    const names = (i18n[currentLang] || i18n.es).roleNames || {};
    roleLabel.innerText = names[selectedRole] || "Rol no disponible";
  }
}

const championDataCache = {};
let ddragonLoaded = false;

// Inicializar catálogos de DDragon una sola vez (descarga es_MX y en_US en paralelo)
async function initDDragon() {
  if (ddragonLoaded) return;
  try {
    const vRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    if (vRes.ok) {
      const versions = await vRes.json();
      latestVersion = versions[0];
      
      const [
        itemsEsRes, itemsEnRes,
        runesEsRes, runesEnRes,
        spellsEsRes, spellsEnRes,
        cRes
      ] = await Promise.all([
        fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/es_MX/item.json`).catch(() => null),
        fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`).catch(() => null),
        fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/es_MX/runesReforged.json`).catch(() => null),
        fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/runesReforged.json`).catch(() => null),
        fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/es_MX/summoner.json`).catch(() => null),
        fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/summoner.json`).catch(() => null),
        fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`).catch(() => null)
      ]);

      if (itemsEsRes && itemsEsRes.ok) {
        const itemData = await itemsEsRes.json();
        for (const [key, val] of Object.entries(itemData.data || {})) {
          ddragonCatalogs.es.items[Number(key)] = val.name;
        }
      }
      if (itemsEnRes && itemsEnRes.ok) {
        const itemData = await itemsEnRes.json();
        for (const [key, val] of Object.entries(itemData.data || {})) {
          ddragonCatalogs.en.items[Number(key)] = val.name;
        }
      }

      if (runesEsRes && runesEsRes.ok) {
        const runesPaths = await runesEsRes.json();
        runesPaths.forEach(path => {
          ddragonCatalogs.es.runes[path.id] = path.name;
          path.slots.forEach(slot => {
            slot.runes.forEach(rune => {
              ddragonCatalogs.es.runes[rune.id] = rune.name;
            });
          });
        });
      }

      if (runesEnRes && runesEnRes.ok) {
        const runesPaths = await runesEnRes.json();
        runesPaths.forEach(path => {
          runeImages[path.id] = `https://ddragon.leagueoflegends.com/cdn/img/${path.icon}`;
          ddragonCatalogs.en.runes[path.id] = path.name;
          path.slots.forEach(slot => {
            slot.runes.forEach(rune => {
              runeImages[rune.id] = `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`;
              ddragonCatalogs.en.runes[rune.id] = rune.name;
            });
          });
        });
      }

      if (spellsEsRes && spellsEsRes.ok) {
        const spellData = await spellsEsRes.json();
        for (const [key, val] of Object.entries(spellData.data || {})) {
          ddragonCatalogs.es.spells[Number(val.key)] = val.name;
        }
      }

      if (spellsEnRes && spellsEnRes.ok) {
        const spellData = await spellsEnRes.json();
        for (const [key, val] of Object.entries(spellData.data || {})) {
          spellImages[Number(val.key)] = val.image.full;
          ddragonCatalogs.en.spells[Number(val.key)] = val.name;
        }
      }

      if (cRes && cRes.ok) {
        const champData = await cRes.json();
        for (const [key, val] of Object.entries(champData.data || {})) {
          championNames[Number(val.key)] = val.id;
        }
      }
      ddragonLoaded = true;
    }
  } catch (e) {
    console.warn("Could not fetch DDragon versions, runes or champions dynamically:", e);
  }
}

// Cargar datos bajo demanda
async function loadData() {
  await initDDragon();

  // Actualizar cabecera del campeón y botones de roles
  const champName = (selectedChamp && championNames[selectedChamp]) || "Aatrox";
  document.getElementById("champion-avatar").src = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champName}.png`;
  updateRoleSelector();
  updateCustomChampionSelectLabel();

  // Recuperar datos granulares bajo demanda
  wpaData = await getChampionRoleData(selectedChamp, selectedRole);
  
  populatePatchDropdowns();
  applyFilters();
}

function populateAndSortChampionSelect() {
  const select = document.getElementById("champion-select");
  if (!select) return;
  
  select.innerHTML = "";

  let champList = [];
  if (appConfig && appConfig.champions && appConfig.champions.length > 0) {
    champList = appConfig.champions.map(c => ({
      id: String(c.id),
      name: c.name || championNames[c.id] || `ID_${c.id}`
    }));
  } else {
    champList = Object.keys(championRolesMap).map(id => ({
      id: String(id),
      name: championNames[id] || `ID_${id}`
    }));
  }

  champList.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  champList.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    select.appendChild(opt);
  });

  if (select.options.length > 0) {
    const hasSelected = Array.from(select.options).some(o => o.value === String(selectedChamp));
    if (!hasSelected) {
      selectedChamp = select.options[0].value;
      const supportedRoles = championRolesMap[selectedChamp] || [0];
      selectedRole = supportedRoles[0];
    }
    select.value = selectedChamp;
  }
}

function updateCustomChampionSelectLabel() {
  const select = document.getElementById("champion-select");
  const label = document.getElementById("selected-champion-label");
  if (select && label && select.selectedOptions.length > 0) {
    label.innerText = select.selectedOptions[0].text;
  }
}

function initCustomChampionSelect() {
  const select = document.getElementById("champion-select");
  const trigger = document.getElementById("champion-select-trigger");
  const dropdown = document.getElementById("champion-select-dropdown");
  const searchInput = document.getElementById("champion-search-input");
  const optionsContainer = document.getElementById("champion-select-options");

  if (!select || !trigger || !dropdown || !optionsContainer) return;

  function renderOptions(filterText = "") {
    optionsContainer.innerHTML = "";
    const options = Array.from(select.options);
    const query = filterText.toLowerCase().trim();

    const filtered = options.filter(opt => opt.text.toLowerCase().includes(query));

    if (filtered.length === 0) {
      optionsContainer.innerHTML = `<div style="padding: 0.75rem; text-align: center; color: var(--text-secondary); font-size: 0.85rem;">Sin resultados</div>`;
      return;
    }

    filtered.forEach(opt => {
      const optionEl = document.createElement("div");
      optionEl.className = `custom-select-option ${opt.value === select.value ? 'selected' : ''}`;
      
      const champName = championNames[opt.value] || opt.text;
      const avatarUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champName}.png`;

      optionEl.innerHTML = `
        <img src="${avatarUrl}" alt="${opt.text}" onerror="this.src='https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Lucian.png';">
        <span>${opt.text}</span>
      `;

      optionEl.addEventListener("click", () => {
        select.value = opt.value;
        selectedChamp = opt.value;
        updateCustomChampionSelectLabel();
        closeDropdown();
        loadData();
      });

      optionsContainer.appendChild(optionEl);
    });
  }

  function openDropdown() {
    dropdown.style.display = "block";
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    renderOptions("");
  }

  function closeDropdown() {
    dropdown.style.display = "none";
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (dropdown.style.display === "none" || !dropdown.style.display) {
      openDropdown();
    } else {
      closeDropdown();
    }
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderOptions(e.target.value);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDropdown();
        trigger.focus();
      } else if (e.key === "Enter") {
        const firstOption = optionsContainer.querySelector(".custom-select-option");
        if (firstOption) {
          firstOption.click();
        }
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  updateCustomChampionSelectLabel();
}

// Configurar controladores de eventos
window.addEventListener("DOMContentLoaded", async () => {
  await loadConfig();
  populateAndSortChampionSelect();
  initCustomChampionSelect();
  await loadData();
  switchLanguage(currentLang);
  if (window.lucide) lucide.createIcons();

  // Selector de Campeón
  document.getElementById("champion-select").addEventListener("change", (e) => {
    selectedChamp = e.target.value;
    updateCustomChampionSelectLabel();
    loadData();
  });

  // Selector de Roles por botones de línea
  document.querySelectorAll("#role-selector .role-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetBtn = e.currentTarget;
      if (targetBtn.classList.contains("disabled")) return;
      
      const roleId = parseInt(targetBtn.getAttribute("data-role"));
      if (selectedRole !== roleId) {
        selectedRole = roleId;
        updateRoleSelector();
        loadData();
      }
    });
  });

  // Pestaña Builds
  document.getElementById("tab-builds").addEventListener("click", () => {
    document.getElementById("tab-builds").classList.add("active");
    document.getElementById("tab-items").classList.remove("active");
    document.getElementById("builds-view").style.display = "grid";
    document.getElementById("items-view").style.display = "none";
    currentTab = "builds";
    applyFilters();
  });

  // Pestaña Items
  document.getElementById("tab-items").addEventListener("click", () => {
    document.getElementById("tab-items").classList.add("active");
    document.getElementById("tab-builds").classList.remove("active");
    document.getElementById("builds-view").style.display = "none";
    document.getElementById("items-view").style.display = "block";
    currentTab = "items";
    applyFilters();
  });

  // Botón Global
  document.getElementById("btn-global").addEventListener("click", (e) => {
    document.getElementById("btn-global").classList.add("active");
    document.getElementById("btn-all-items").classList.remove("active");
    currentView = "global";
    applyFilters();
  });

  // Botón Todos los Objetos
  document.getElementById("btn-all-items").addEventListener("click", (e) => {
    document.getElementById("btn-all-items").classList.add("active");
    document.getElementById("btn-global").classList.remove("active");
    currentView = "all-items";
    applyFilters();
  });

  // Botón Filtros
  document.getElementById("btn-filters").addEventListener("click", (e) => {
    const panel = document.getElementById("filter-panel");
    const btn = document.getElementById("btn-filters");
    if (panel.style.display === "none" || panel.style.display === "") {
      panel.style.display = "flex";
      btn.classList.add("active");
    } else {
      panel.style.display = "none";
      btn.classList.remove("active");
      // Limpiar filtros al cerrar el panel
      document.getElementById("search-input").value = "";
      document.getElementById("wpa-pos-gen").checked = false;
      document.getElementById("wpa-neg-gen").checked = false;
      document.querySelectorAll("#filter-panel input[data-wpa-stat]").forEach(cb => cb.checked = false);
      applyFilters();
    }
  });

  // Click en cabeceras de columnas (WPA / Compras) para alternar ordenamiento
  document.querySelectorAll('.sort-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      const sortType = e.target.getAttribute('data-sort');
      currentSort = sortType;
      
      // Sincronizar select dropdown de ordenamiento avanzado
      const select = document.getElementById("sort-by");
      if (select && (sortType === 'wpa' || sortType === 'sample_size')) {
        select.value = sortType;
      }
      
      // Actualizar clase activa en todos los triggers correspondientes de la web
      document.querySelectorAll('.sort-trigger').forEach(trigger => {
        if (trigger.getAttribute('data-sort') === sortType) {
          trigger.classList.add('active');
        } else {
          trigger.classList.remove('active');
        }
      });
      
      applyFilters();
    });
  });
});
function onAdvancedSortChange() {
  const select = document.getElementById("sort-by");
  if (!select) return;
  currentSort = select.value;

  // Actualizar clases activas en los triggers tradicionales de la cabecera
  document.querySelectorAll('.sort-trigger').forEach(trigger => {
    const sortType = trigger.getAttribute('data-sort');
    if (sortType === currentSort) {
      trigger.classList.add('active');
    } else {
      trigger.classList.remove('active');
    }
  });

  applyFilters();
}

function getChampionDisplayName(champId) {
  if (championNames && championNames[champId]) {
    return championNames[champId];
  }
  const select = document.getElementById("champion-select");
  if (select) {
    const opt = Array.from(select.options).find(o => o.value === String(champId));
    if (opt) return opt.text;
  }
  return `Champion_${champId}`;
}

function downloadJsonFile(filename, dataObj) {
  const jsonStr = JSON.stringify(dataObj, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toggleExportDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById("export-dropdown");
  if (!dropdown) return;
  const isHidden = dropdown.style.display === "none" || !dropdown.style.display;
  dropdown.style.display = isHidden ? "block" : "none";
  if (isHidden && window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener("click", function(event) {
  const container = document.getElementById("export-split-btn");
  const dropdown = document.getElementById("export-dropdown");
  if (dropdown && dropdown.style.display !== "none") {
    if (container && !container.contains(event.target)) {
      dropdown.style.display = "none";
    }
  }
});

async function getChampionRoleData(champId, roleId) {
  const cacheKey = `${champId}_role_${roleId}`;
  if (championDataCache[cacheKey]) {
    return championDataCache[cacheKey];
  }

  const pathsToTry = [
    `data/granular/coachless_granular_wpa_${champId}_role_${roleId}.json`,
    `data/granular/coachless_granular_wpa_${champId}.json`,
    `../data/granular/coachless_granular_wpa_${champId}_role_${roleId}.json`,
    `../data/granular/coachless_granular_wpa_${champId}.json`
  ];

  for (const p of pathsToTry) {
    try {
      const response = await fetch(p);
      if (response.ok) {
        const data = await response.json();
        championDataCache[cacheKey] = data;
        return data;
      }
    } catch (err) {
      // Intentar siguiente ruta
    }
  }

  console.warn(`No se encontraron datos para ${champId} (rol ${roleId})`);
  return [];
}

function buildItemSetFromData(champId, roleId, rawData, patches, viewMode = "global") {
  if (!rawData || rawData.length === 0) return null;

  const patchesSet = new Set(rawData.map(d => d.patch));
  const patchesList = (patches && patches.length > 0) ? patches : Array.from(patchesSet).sort(comparePatches);
  const startPatch = patchesList[0] || "16.1";
  const endPatch = patchesList[patchesList.length - 1] || "16.16";

  const granularFiltered = rawData.filter(d => {
    if (d.last_changed_patch && comparePatches(d.patch, d.last_changed_patch) < 0) {
      return false;
    }
    return comparePatches(d.patch, startPatch) >= 0 && comparePatches(d.patch, endPatch) <= 0;
  });

  if (granularFiltered.length === 0) return null;

  const aggregated = {};
  granularFiltered.forEach(r => {
    const key = `${r.category}_${r.id}`;
    if (!aggregated[key]) {
      aggregated[key] = {
        category: r.category,
        id: r.id,
        name: r.name,
        last_changed_patch: r.last_changed_patch,
        weighted_wpa_sum: 0,
        total_sample: 0,
        records: []
      };
    }
    aggregated[key].total_sample += r.sample_size;
    aggregated[key].weighted_wpa_sum += r.wpa * r.sample_size;
    aggregated[key].records.push(r);
  });

  const totalSampleByCategory = {};
  for (const key in aggregated) {
    const item = aggregated[key];
    totalSampleByCategory[item.category] = (totalSampleByCategory[item.category] || 0) + item.total_sample;
  }

  const list = [];
  const maxPatchIdx = patchesList.length > 0 ? (patchesList.length - 1) : 15;
  const lambda = 0.75;

  for (const key in aggregated) {
    const item = aggregated[key];
    
    if (viewMode === "global") {
      const totalCategoryVolume = totalSampleByCategory[item.category] || 1000;
      const minMarketShareSample = Math.max(50, Math.round(totalCategoryVolume * 0.005));
      if (item.total_sample < minMarketShareSample) {
        continue;
      }
    } else if (item.total_sample < 50) {
      continue;
    }

    item.records.sort((a, b) => comparePatches(a.patch, b.patch));
    
    let recencyWeightedWpaSum = 0;
    let recencyWeightedSampleSum = 0;
    
    item.records.forEach(r => {
      const patchIdx = patchesList.indexOf(r.patch);
      const patchDist = patchIdx >= 0 ? (maxPatchIdx - patchIdx) : 0;
      const decayWeight = Math.pow(lambda, patchDist);
      const effectiveWeight = r.sample_size * decayWeight;
      
      recencyWeightedWpaSum += r.wpa * effectiveWeight;
      recencyWeightedSampleSum += effectiveWeight;
    });
    
    const overallWpa = recencyWeightedSampleSum > 0 ? (recencyWeightedWpaSum / recencyWeightedSampleSum) : (item.weighted_wpa_sum / item.total_sample);

    list.push({
      category: item.category,
      id: item.id,
      name: item.name,
      wpa: overallWpa,
      sample_size: item.total_sample
    });
  }

  const starterItems = list.filter(item => item.category === "Starter" && item.wpa > 0);
  starterItems.sort((a, b) => b.wpa - a.wpa);
  
  const bootsItems = list.filter(item => item.category === "Boots" && item.wpa > 0);
  bootsItems.sort((a, b) => b.wpa - a.wpa);

  const basicLoL = [
    ...starterItems.map(item => ({ id: String(item.id), count: 1 })),
    { id: "2003", count: 1 },
    ...bootsItems.map(item => ({ id: String(item.id), count: 1 }))
  ];

  const firstItems = list.filter(item => item.category === "1st Item" && item.wpa > 0);
  firstItems.sort((a, b) => b.wpa - a.wpa);
  const firstLoL = firstItems.map(item => ({ id: String(item.id), count: 1 }));

  const secondItems = list.filter(item => item.category === "2nd Item" && item.wpa > 0);
  secondItems.sort((a, b) => b.wpa - a.wpa);
  const secondLoL = secondItems.map(item => ({ id: String(item.id), count: 1 }));

  const thirdItems = list.filter(item => item.category === "3rd Item" && item.wpa > 0);
  thirdItems.sort((a, b) => b.wpa - a.wpa);
  const thirdLoL = thirdItems.map(item => ({ id: String(item.id), count: 1 }));

  const itemsPorWpa = list.filter(item => item.category === "All Items" && item.wpa > 0);
  itemsPorWpa.sort((a, b) => b.wpa - a.wpa);
  const itemsPorWpaLoL = itemsPorWpa.map(item => ({ id: String(item.id), count: 1 }));

  const blocks = [];
  
  if (basicLoL.length > 0) {
    blocks.push({
      "type": t("blockBasics"),
      "items": basicLoL,
      "showIfSummonerSpell": "",
      "hideIfSummonerSpell": "",
      "minSummonerLevel": -1,
      "maxSummonerLevel": -1
    });
  }

  if (firstLoL.length > 0) {
    blocks.push({
      "type": t("block1st"),
      "items": firstLoL,
      "showIfSummonerSpell": "",
      "hideIfSummonerSpell": "",
      "minSummonerLevel": -1,
      "maxSummonerLevel": -1
    });
  }

  if (secondLoL.length > 0) {
    blocks.push({
      "type": t("block2nd"),
      "items": secondLoL,
      "showIfSummonerSpell": "",
      "hideIfSummonerSpell": "",
      "minSummonerLevel": -1,
      "maxSummonerLevel": -1
    });
  }

  if (thirdLoL.length > 0) {
    blocks.push({
      "type": t("block3rd"),
      "items": thirdLoL,
      "showIfSummonerSpell": "",
      "hideIfSummonerSpell": "",
      "minSummonerLevel": -1,
      "maxSummonerLevel": -1
    });
  }

  if (itemsPorWpaLoL.length > 0) {
    blocks.push({
      "type": t("blockItemsWpa"),
      "items": itemsPorWpaLoL,
      "showIfSummonerSpell": "",
      "hideIfSummonerSpell": "",
      "minSummonerLevel": -1,
      "maxSummonerLevel": -1
    });
  }

  // Sección "Todos": contiene el catálogo completo de objetos con WPA > 0 sin filtro de cuota de mercado
  const allItemsUnfilteredList = [];
  for (const key in aggregated) {
    const item = aggregated[key];
    if (item.category === "All Items" && item.total_sample >= 50) {
      item.records.sort((a, b) => comparePatches(a.patch, b.patch));
      let recencyWeightedWpaSum = 0;
      let recencyWeightedSampleSum = 0;
      item.records.forEach(r => {
        const patchIdx = patchesList.indexOf(r.patch);
        const patchDist = patchIdx >= 0 ? (maxPatchIdx - patchIdx) : 0;
        const decayWeight = Math.pow(lambda, patchDist);
        const effectiveWeight = r.sample_size * decayWeight;
        recencyWeightedWpaSum += r.wpa * effectiveWeight;
        recencyWeightedSampleSum += effectiveWeight;
      });
      const overallWpa = recencyWeightedSampleSum > 0 ? (recencyWeightedWpaSum / recencyWeightedSampleSum) : (item.weighted_wpa_sum / item.total_sample);
      if (overallWpa > 0) {
        allItemsUnfilteredList.push({ id: String(item.id), wpa: overallWpa });
      }
    }
  }
  allItemsUnfilteredList.sort((a, b) => b.wpa - a.wpa);
  const todosLoL = allItemsUnfilteredList.map(item => ({ id: item.id, count: 1 }));

  if (todosLoL.length > 0) {
    blocks.push({
      "type": t("blockAll"),
      "items": todosLoL,
      "showIfSummonerSpell": "",
      "hideIfSummonerSpell": "",
      "minSummonerLevel": -1,
      "maxSummonerLevel": -1
    });
  }

  const finalBlocks = blocks.filter(b => b.items.length > 0);
  if (finalBlocks.length === 0) return null;

  const roleMapShort = (i18n[currentLang] || i18n.es).roleShort || roleLabelsShort;
  const roleNameShort = roleMapShort[roleId] || "General";
  const championDisplayName = getChampionDisplayName(champId);

  return {
    "title": `Zinkoachless - ${championDisplayName} - ${roleNameShort}`,
    "associatedChampions": [parseInt(champId)],
    "associatedMaps": [],
    "blocks": finalBlocks
  };
}

function exportLoLItemSet() {
  const dropdown = document.getElementById("export-dropdown");
  if (dropdown) dropdown.style.display = "none";

  const selectedChamp = document.getElementById("champion-select").value;
  const championDisplayName = getChampionDisplayName(selectedChamp);
  const roleMapShort = (i18n[currentLang] || i18n.es).roleShort || roleLabelsShort;
  const roleNameShort = roleMapShort[selectedRole] || "General";

  const itemSetJson = buildItemSetFromData(selectedChamp, selectedRole, wpaData, availablePatches, currentView);
  if (!itemSetJson) {
    alert(t("alertNoDataForExport"));
    return;
  }

  const jsonStr = JSON.stringify(itemSetJson, null, 2);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(jsonStr).then(() => {
      alert(t("alertSetCopied", championDisplayName, roleNameShort));
    }).catch(err => {
      console.error("Error al copiar al portapapeles: ", err);
      alert(t("alertSetCopyError"));
      console.log(jsonStr);
    });
  } else {
    alert(t("alertSetCopyError"));
    console.log(jsonStr);
  }
}

function exportCurrentLoLItemSetFile() {
  const dropdown = document.getElementById("export-dropdown");
  if (dropdown) dropdown.style.display = "none";

  const selectedChamp = document.getElementById("champion-select").value;
  const championDisplayName = getChampionDisplayName(selectedChamp);
  const roleMapShort = (i18n[currentLang] || i18n.es).roleShort || roleLabelsShort;
  const roleNameShort = roleMapShort[selectedRole] || "General";

  const itemSetJson = buildItemSetFromData(selectedChamp, selectedRole, wpaData, availablePatches, currentView);
  if (!itemSetJson) {
    alert(t("alertNoDataForExport"));
    return;
  }

  const filename = `Zinkoachless_${championDisplayName}_${roleNameShort}.json`;
  downloadJsonFile(filename, itemSetJson);
}

let modalSelectedChampIds = new Set();

function openBulkExportModal() {
  const dropdown = document.getElementById("export-dropdown");
  if (dropdown) dropdown.style.display = "none";

  const modal = document.getElementById("bulk-export-modal");
  if (!modal) return;

  // Por defecto, si está vacío, inicializar con todos los campeones configurados
  if (modalSelectedChampIds.size === 0) {
    const allIds = appConfig && appConfig.champions 
      ? appConfig.champions.map(c => String(c.id))
      : Object.keys(championRolesMap).map(String);
    allIds.forEach(id => modalSelectedChampIds.add(id));
  }

  const searchInput = document.getElementById("modal-search-input");
  if (searchInput) searchInput.value = "";

  renderModalChampionCards();
  updateModalSummary();

  modal.style.display = "flex";
  if (window.lucide) window.lucide.createIcons();
}

function closeBulkExportModal() {
  const modal = document.getElementById("bulk-export-modal");
  if (modal) modal.style.display = "none";
}

function renderModalChampionCards(filterText = "") {
  const container = document.getElementById("modal-champions-list");
  if (!container) return;

  container.innerHTML = "";

  let champList = [];
  if (appConfig && appConfig.champions && appConfig.champions.length > 0) {
    champList = appConfig.champions.map(c => ({
      id: String(c.id),
      name: c.name || championNames[c.id] || `ID_${c.id}`,
      roles: c.roles || championRolesMap[c.id] || [0]
    }));
  } else {
    champList = Object.keys(championRolesMap).map(id => ({
      id: String(id),
      name: championNames[id] || `ID_${id}`,
      roles: championRolesMap[id] || [0]
    }));
  }

  champList.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  const query = filterText.toLowerCase().trim();
  const filtered = champList.filter(c => c.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-secondary);">${t('noResults')}</div>`;
    return;
  }

  const roleMapShort = (i18n[currentLang] || i18n.es).roleShort || roleLabelsShort;

  filtered.forEach(c => {
    const isSelected = modalSelectedChampIds.has(c.id);
    const card = document.createElement("div");
    card.className = `modal-champ-card ${isSelected ? 'selected' : ''}`;
    card.setAttribute("data-champ-id", c.id);

    const champName = championNames[c.id] || c.name;
    const avatarUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champName}.png`;

    const rolesHtml = c.roles.map(r => `<span class="modal-role-badge">${roleMapShort[r] || r}</span>`).join("");

    card.innerHTML = `
      <input type="checkbox" class="modal-champ-checkbox" ${isSelected ? 'checked' : ''}>
      <img src="${avatarUrl}" class="modal-champ-avatar" alt="${c.name}" onerror="this.src='https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Lucian.png';">
      <div class="modal-champ-info">
        <span class="modal-champ-name">${c.name}</span>
        <div class="modal-champ-roles">${rolesHtml}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      toggleModalChampion(c.id);
    });

    container.appendChild(card);
  });
}

function filterModalChampions() {
  const searchInput = document.getElementById("modal-search-input");
  const query = searchInput ? searchInput.value : "";
  renderModalChampionCards(query);
}

function toggleModalChampion(champId) {
  champId = String(champId);
  if (modalSelectedChampIds.has(champId)) {
    modalSelectedChampIds.delete(champId);
  } else {
    modalSelectedChampIds.add(champId);
  }

  const card = document.querySelector(`.modal-champ-card[data-champ-id="${champId}"]`);
  if (card) {
    const isSelected = modalSelectedChampIds.has(champId);
    card.classList.toggle("selected", isSelected);
    const cb = card.querySelector(".modal-champ-checkbox");
    if (cb) cb.checked = isSelected;
  }

  updateModalSummary();
}

function setModalSelection(type) {
  const allIds = appConfig && appConfig.champions 
    ? appConfig.champions.map(c => String(c.id))
    : Object.keys(championRolesMap).map(String);

  if (type === 'all') {
    allIds.forEach(id => modalSelectedChampIds.add(id));
  } else if (type === 'none') {
    modalSelectedChampIds.clear();
  } else if (type === 'current') {
    modalSelectedChampIds.clear();
    modalSelectedChampIds.add(String(selectedChamp));
  }

  const searchInput = document.getElementById("modal-search-input");
  const query = searchInput ? searchInput.value : "";
  renderModalChampionCards(query);
  updateModalSummary();
}

function updateModalSummary() {
  const summaryEl = document.getElementById("modal-selection-summary");
  if (!summaryEl) return;

  const selectedCount = modalSelectedChampIds.size;
  let totalSets = 0;
  modalSelectedChampIds.forEach(id => {
    const roles = championRolesMap[id] || [0];
    totalSets += roles.length;
  });

  summaryEl.innerText = t("modalSelectionSummary", selectedCount, totalSets);
}

async function executeCustomExport(mode = 'clipboard') {
  if (modalSelectedChampIds.size === 0) {
    alert(t("alertSelectChamp"));
    return;
  }

  const btnCopy = document.getElementById("btn-modal-copy");
  const btnDownload = document.getElementById("btn-modal-download");
  const activeBtn = mode === 'download' ? btnDownload : btnCopy;
  const originalHtml = activeBtn ? activeBtn.innerHTML : "";

  if (activeBtn) {
    activeBtn.innerHTML = `<i data-lucide="loader" style="width: 15px; height: 15px;"></i> <span>${t('modalProcessing')}</span>`;
    if (window.lucide) window.lucide.createIcons();
  }

  try {
    const allItemSets = [];
    const roleOrder = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 };

    // Filtrar los campeones seleccionados
    const selectedEntries = Object.entries(championRolesMap)
      .filter(([champId]) => modalSelectedChampIds.has(String(champId)))
      .map(([champId, roles]) => {
        const name = getChampionDisplayName(champId);
        const sortedRoles = [...roles].sort((a, b) => (roleOrder[a] ?? a) - (roleOrder[b] ?? b));
        return {
          champId,
          name,
          roles: sortedRoles
        };
      });

    selectedEntries.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

    let completed = 0;
    const totalCount = selectedEntries.reduce((acc, c) => acc + c.roles.length, 0);

    for (const champ of selectedEntries) {
      for (const roleId of champ.roles) {
        if (activeBtn) {
          activeBtn.innerHTML = `<i data-lucide="loader" style="width: 15px; height: 15px;"></i> <span>${t('modalGenerating', completed, totalCount)}</span>`;
          if (window.lucide) window.lucide.createIcons();
        }
        const rawData = await getChampionRoleData(champ.champId, roleId);
        completed++;
        if (rawData && rawData.length > 0) {
          const itemSet = buildItemSetFromData(champ.champId, roleId, rawData, availablePatches, "global");
          if (itemSet && itemSet.blocks && itemSet.blocks.length > 0) {
            allItemSets.push(itemSet);
          }
        }
      }
    }

    if (allItemSets.length === 0) {
      alert(t("alertNoDataForExport"));
      return;
    }

    const payload = {
      "itemSets": allItemSets
    };
    const jsonStr = JSON.stringify(payload, null, 2);

    if (mode === 'download') {
      downloadJsonFile("Zinkoachless_Custom_Item_Sets.json", payload);
      alert(t("alertBulkDownloaded", "Zinkoachless_Custom_Item_Sets.json", allItemSets.length, selectedEntries.length));
      closeBulkExportModal();
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(jsonStr);
        alert(t("alertBulkCopied", allItemSets.length, selectedEntries.length));
        closeBulkExportModal();
      } else {
        downloadJsonFile("Zinkoachless_Custom_Item_Sets.json", payload);
        alert(t("alertBulkDownloaded", "Zinkoachless_Custom_Item_Sets.json", allItemSets.length, selectedEntries.length));
        closeBulkExportModal();
      }
    }
  } catch (err) {
    console.error("Error al exportar sets personalizados:", err);
    alert("Error: " + err.message);
  } finally {
    if (activeBtn) {
      activeBtn.innerHTML = originalHtml;
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

function updateStaticDOMTexts() {
  document.title = t("title");
  
  // Header buttons
  const btnGlobal = document.getElementById("btn-global");
  if (btnGlobal) {
    btnGlobal.title = t("btnGlobalTitle");
    btnGlobal.innerHTML = `<i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>${t('btnGlobal')}`;
  }
  const btnAll = document.getElementById("btn-all-items");
  if (btnAll) {
    btnAll.title = t("btnAllItemsTitle");
    btnAll.innerHTML = `<i data-lucide="layers" style="width: 16px; height: 16px;"></i>${t('btnAllItems')}`;
  }
  const btnFilters = document.getElementById("btn-filters");
  if (btnFilters) {
    btnFilters.innerHTML = `<i data-lucide="sliders-horizontal" style="width: 16px; height: 16px;"></i> ${t('btnFilters')}`;
  }
  
  // Export split button
  const btnExportSet = document.getElementById("btn-export-set");
  if (btnExportSet) {
    btnExportSet.title = t("btnExportSetTitle");
    const span = btnExportSet.querySelector("span");
    if (span) span.innerText = t("btnExportSet");
  }

  // Export dropdown
  const exportDropdown = document.getElementById("export-dropdown");
  if (exportDropdown) {
    const titles = exportDropdown.querySelectorAll(".split-dropdown-section-title");
    if (titles[0]) titles[0].innerText = t("exportDropdownTitle");
    if (titles[1]) titles[1].innerText = t("exportCurrentTitle");
    
    const items = exportDropdown.querySelectorAll(".split-dropdown-item");
    if (items[0]) {
      items[0].querySelector(".item-title").innerText = t("exportBulkTitle");
      items[0].querySelector(".item-sub").innerText = t("exportBulkSub");
    }
    if (items[1]) {
      items[1].querySelector(".item-title").innerText = t("exportCurrentCopy");
      items[1].querySelector(".item-sub").innerText = t("exportCurrentCopySub");
    }
    if (items[2]) {
      items[2].querySelector(".item-title").innerText = t("exportCurrentDownload");
      items[2].querySelector(".item-sub").innerText = t("exportCurrentDownloadSub");
    }
  }

  // Tabs
  const tabBuilds = document.getElementById("tab-builds");
  if (tabBuilds) {
    tabBuilds.innerHTML = `<i data-lucide="layout-grid" style="width: 16px; height: 16px;"></i> ${t('tabBuilds')}`;
  }
  const tabItems = document.getElementById("tab-items");
  if (tabItems) {
    tabItems.innerHTML = `<i data-lucide="list" style="width: 16px; height: 16px;"></i> ${t('tabItems')}`;
  }

  // Search input placeholder
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.placeholder = t("searchPlaceholder");
  }

  // Champion search placeholder
  const champSearchInput = document.getElementById("champion-search-input");
  if (champSearchInput) {
    champSearchInput.placeholder = t("searchChampion");
  }

  // Modal elements
  const modalHeaderH3 = document.querySelector("#bulk-export-modal .modal-header h3");
  if (modalHeaderH3) modalHeaderH3.innerText = t("modalTitle");
  const modalHeaderP = document.querySelector("#bulk-export-modal .modal-header p");
  if (modalHeaderP) modalHeaderP.innerText = t("modalSub");
  const modalSearchInput = document.getElementById("modal-search-input");
  if (modalSearchInput) modalSearchInput.placeholder = t("modalSearchPlaceholder");
  
  const modalChips = document.querySelectorAll(".modal-chip-btn");
  if (modalChips[0]) modalChips[0].innerText = t("modalBtnAll");
  if (modalChips[1]) modalChips[1].innerText = t("modalBtnNone");
  if (modalChips[2]) modalChips[2].innerText = t("modalBtnCurrent");

  const modalCancelBtn = document.querySelector("#bulk-export-modal .modal-footer button:first-child");
  if (modalCancelBtn) modalCancelBtn.innerText = t("modalCancel");
  const btnModalCopy = document.getElementById("btn-modal-copy");
  if (btnModalCopy) {
    const span = btnModalCopy.querySelector("span");
    if (span) span.innerText = t("modalCopy");
  }
  const btnModalDownload = document.getElementById("btn-modal-download");
  if (btnModalDownload) {
    const span = btnModalDownload.querySelector("span");
    if (span) span.innerText = t("modalDownload");
  }

  // Overview title and badge legends
  const overviewH2 = document.querySelector(".overview-section h2");
  if (overviewH2) overviewH2.innerText = t("overviewTitle");

  const badgeLegend = document.querySelector(".badge-legend");
  if (badgeLegend) {
    badgeLegend.innerHTML = `
      <span title="${t('badgeMetaTitle')}"><strong style="color: #60a5fa;">⭐</strong> ${t('badgeMetaText')}</span>
      <span title="${t('badgeSituationalTitle')}"><strong style="color: #c084fc;">🎯</strong> ${t('badgeSituationalText')}</span>
      <span title="${t('badgeTrendingTitle')}"><strong style="color: #10b981;">📈</strong> ${t('badgeTrendingText')}</span>
      <span title="${t('badgeAdjustedTitle')}"><strong style="color: #f59e0b;">⚡</strong> ${t('badgeAdjustedText')}</span>
    `;
  }

  // Sort dropdown options
  const sortBySelect = document.getElementById("sort-by");
  if (sortBySelect) {
    const opts = sortBySelect.options;
    if (opts[0]) opts[0].text = t("sortSmartRank");
    if (opts[1]) opts[1].text = t("sortWpa");
    if (opts[2]) opts[2].text = t("sortSample");
  }

  const sortOrderSelect = document.getElementById("sort-order");
  if (sortOrderSelect) {
    const opts = sortOrderSelect.options;
    if (opts[0]) opts[0].text = t("sortDesc");
    if (opts[1]) opts[1].text = t("sortAsc");
  }

  // Slot card headers (WPA / Compras / Picks)
  document.querySelectorAll(".sort-trigger").forEach(trigger => {
    const sort = trigger.getAttribute("data-sort");
    if (sort === "wpa") trigger.innerText = t("sortTriggerWpa");
    else if (sort === "sample_size") {
      const card = trigger.closest(".slot-card");
      const isPick = card && (card.querySelector("#list-Keystone") || card.querySelector("#list-Spell"));
      trigger.innerText = isPick ? t("sortTriggerPicks") : t("sortTriggerBuys");
    }
  });

  if (window.lucide) lucide.createIcons();
}

function switchLanguage(lang) {
  if (lang !== "es" && lang !== "en") lang = "es";
  currentLang = lang;
  localStorage.setItem("zinkoachless_lang", lang);

  const btnEs = document.getElementById("lang-btn-es");
  const btnEn = document.getElementById("lang-btn-en");
  if (btnEs) btnEs.classList.toggle("active", lang === "es");
  if (btnEn) btnEn.classList.toggle("active", lang === "en");

  updateStaticDOMTexts();
  updateRoleSelector();
  updateCustomChampionSelectLabel();
  applyFilters();

  const modal = document.getElementById("bulk-export-modal");
  if (modal && modal.style.display !== "none") {
    renderModalChampionCards(document.getElementById("modal-search-input")?.value || "");
    updateModalSummary();
  }
}

document.addEventListener("click", function(event) {
  const modal = document.getElementById("bulk-export-modal");
  if (modal && event.target === modal) {
    closeBulkExportModal();
  }
  // Si se hace clic fuera del nombre del objeto, restaurar la vista normal con insignias
  if (!event.target.closest(".item-name-text")) {
    document.querySelectorAll(".item-row.show-full-name").forEach(r => r.classList.remove("show-full-name"));
  }
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    closeBulkExportModal();
    const dropdown = document.getElementById("export-dropdown");
    if (dropdown) dropdown.style.display = "none";
    document.querySelectorAll(".item-row.show-full-name").forEach(r => r.classList.remove("show-full-name"));
  }
});

// Exponer funciones globales para interacción con HTML
window.switchLanguage = switchLanguage;
window.openBulkExportModal = openBulkExportModal;
window.closeBulkExportModal = closeBulkExportModal;
window.filterModalChampions = filterModalChampions;
window.setModalSelection = setModalSelection;
window.toggleModalChampion = toggleModalChampion;
window.executeCustomExport = executeCustomExport;
window.toggleExportDropdown = toggleExportDropdown;
window.exportLoLItemSet = exportLoLItemSet;
window.exportCurrentLoLItemSetFile = exportCurrentLoLItemSetFile;


