// Diccionarios de mappings específicos para iconos de Riot DDragon
const spellImages = {
  1: "SummonerBoost.png",
  3: "SummonerExhaust.png",
  4: "SummonerFlash.png",
  6: "SummonerHaste.png",
  7: "SummonerHeal.png",
  12: "SummonerTeleport.png",
  14: "SummonerDot.png",
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


let latestVersion = "16.16.1";
let wpaData = []; // Esto guardará los registros granulares (por parche)
let currentView = "global"; // "global" o "all-items"
let currentSort = "wpa";      // "wpa" o "sample_size"
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
    // Seleccionar por defecto 16.9
    if (patch === "16.9") {
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
    container.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.875rem;">Sin datos</div>`;
    return;
  }

  // Ordenar por selección activa (WPA, Compras o métricas avanzadas) y orden (ascendente/descendente)
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
      valA = (a.details && a.details[currentSort] !== undefined && a.details[currentSort] !== null) ? a.details[currentSort] : -999;
      valB = (b.details && b.details[currentSort] !== undefined && b.details[currentSort] !== null) ? b.details[currentSort] : -999;
    }
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  items.forEach(item => {
    const sign = item.wpa >= 0 ? "+" : "";
    const wpaClass = item.wpa >= 0 ? "wpa-positive" : "wpa-negative";
    const iconUrl = getImageUrl(item);
    
    const row = document.createElement("div");
    row.className = "item-row";
    if (item.category === "All Items") {
      row.classList.add("expandable");
    }
    
    row.innerHTML = `
      <div class="item-icon">
        <img src="${iconUrl}" alt="${item.name}" onerror="this.onerror=function(){this.onerror=null;this.src='https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/1001.png';}; this.src='https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${item.id}.png';">
      </div>
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-subtext">ID: ${item.id}</div>
      </div>
      <div class="item-stats">
        <div class="wpa-value ${wpaClass}">${sign}${item.wpa.toFixed(2)}%</div>
        <div class="buys-count">${formatNumber(item.sample_size)}</div>
      </div>
      ${item.category === "All Items" ? `
      <div class="item-expand-trigger">
        <i data-lucide="chevron-down" style="width: 18px; height: 18px; color: var(--text-secondary);"></i>
      </div>` : ""}
    `;

    if (item.category === "All Items") {
      row.addEventListener("click", (e) => {
        if (e.target.closest(".item-details-expanded")) return;
        toggleItemDetails(row, item);
      });
    }

    container.appendChild(row);
  });
  lucide.createIcons();
}

function applyFilters() {
  const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();
  const fromSelect = document.getElementById("patch-from");
  const toSelect = document.getElementById("patch-to");
  
  const startPatch = fromSelect.value || (availablePatches[0] || "16.1");
  const endPatch = toSelect.value || (availablePatches[availablePatches.length - 1] || "16.16");

  // Actualizar el badge del rango de parches activo en la interfaz
  const patchTag = document.getElementById("active-patch-tag");
  if (patchTag) {
    if (availablePatches.length > 0 && startPatch === availablePatches[0] && endPatch === availablePatches[availablePatches.length - 1]) {
      patchTag.innerText = `Parches: ${startPatch} - ${endPatch} (Completo)`;
    } else {
      patchTag.innerText = `Parches: ${startPatch} - ${endPatch}`;
    }
  }

  // 1. Filtrar registros por parches seleccionados (rango inclusive)
  const granularFiltered = wpaData.filter(d => {
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
        weighted_wpa_sum: 0,
        total_sample: 0,
        records: []
      };
    }
    aggregated[key].total_sample += r.sample_size;
    aggregated[key].weighted_wpa_sum += r.wpa * r.sample_size;
    aggregated[key].records.push(r);
  });

  // Convertir a lista y calcular promedios
  const aggregatedList = [];
  for (const key in aggregated) {
    const item = aggregated[key];
    if (item.total_sample > 0) {
      let details = null;
      if (item.records.length > 0 && item.records.some(r => r.details)) {
        details = aggregateLocalDetails(item.records);
      }
      aggregatedList.push({
        category: item.category,
        id: item.id,
        name: item.name,
        wpa: item.weighted_wpa_sum / item.total_sample,
        sample_size: item.total_sample,
        details: details
      });
    }
  }

  // 3. Aplicar filtros de búsqueda y WPA sobre los agregados
  let filtered = aggregatedList.filter(item => {
    // Filtro de búsqueda
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery) && !String(item.id).includes(searchQuery)) {
      return false;
    }

    // Filtros de WPA Generales
    const checkPosGen = document.getElementById("wpa-pos-gen").checked;
    const checkNegGen = document.getElementById("wpa-neg-gen").checked;
    if (checkPosGen && item.wpa < 0) return false;
    if (checkNegGen && item.wpa > 0) return false;

    // Filtros de WPA Avanzados (Solo si es item del catálogo general)
    if (item.category === "All Items") {
      const checkedAdvanced = document.querySelectorAll("#filter-panel input[data-wpa-stat]:checked");
      if (checkedAdvanced.length > 0) {
        if (!item.details) return false;
        for (const cb of checkedAdvanced) {
          const key = cb.getAttribute("data-wpa-stat");
          const val = item.details[key];
          if (val === undefined || val === null || val < 0) {
            return false;
          }
        }
      }
    }

    // Filtro de muestra (Global vs Todos los Objetos)
    if (currentView === "global" && item.sample_size < 1000) {
      return false;
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

const championNames = {
  236: "Lucian",
  901: "Smolder"
};

const championRoles = {
  236: "Tirador / ADC (Bot)",
  901: "Tirador / ADC (Bot)"
};

let selectedChamp = "236";

// Cargar datos
async function loadData() {
  // Intentar obtener la versión más reciente de DDragon y mapear runas y campeones dinámicamente
  try {
    const vRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    if (vRes.ok) {
      const versions = await vRes.json();
      latestVersion = versions[0];
      console.log("Latest DDragon version:", latestVersion);
      
      // Cargar catálogo de runas para poblar sus iconos reales
      const rRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/runesReforged.json`);
      if (rRes.ok) {
        const runesPaths = await rRes.json();
        runesPaths.forEach(path => {
          runeImages[path.id] = `https://ddragon.leagueoflegends.com/cdn/img/${path.icon}`;
          path.slots.forEach(slot => {
            slot.runes.forEach(rune => {
              runeImages[rune.id] = `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`;
            });
          });
        });
        console.log("Runes mapped successfully from DDragon.");
      }

      // Cargar catálogo de campeones para mapear IDs a nombres
      const cRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
      if (cRes.ok) {
        const champData = await cRes.json();
        for (const [key, val] of Object.entries(champData.data)) {
          championNames[Number(val.key)] = val.id;
        }
        console.log("Champions mapped successfully from DDragon.");
      }
    }
  } catch (e) {
    console.warn("Could not fetch DDragon versions, runes or champions dynamically:", e);
  }

  // Actualizar cabecera del campeón
  const champName = championNames[selectedChamp];
  document.getElementById("champion-avatar").src = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champName}.png`;
  document.getElementById("champion-role").innerText = championRoles[selectedChamp];

  try {
    const response = await fetch(`../data/granular/coachless_granular_wpa_${selectedChamp}.json`);
    if (!response.ok) {
      throw new Error("No se pudo cargar el JSON del campeón.");
    }
    wpaData = await response.json();
  } catch (err) {
    console.warn("Cargando datos embebidos granulares de respaldo.");
    wpaData = selectedChamp === "236" ? fallbackGranularData236 : fallbackGranularData901;
  }
  populatePatchDropdowns();
  applyFilters();
}

// Configurar controladores de eventos
window.addEventListener("DOMContentLoaded", () => {
  loadData();
  lucide.createIcons();

  // Selector de Campeón
  document.getElementById("champion-select").addEventListener("change", (e) => {
    selectedChamp = e.target.value;
    loadData();
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


function toggleItemDetails(row, item) {
  const nextEl = row.nextElementSibling;
  const isExpanded = nextEl && nextEl.classList.contains("item-details-expanded");

  if (isExpanded) {
    nextEl.remove();
    row.classList.remove("expanded");
    const icon = row.querySelector(".item-expand-trigger i");
    if (icon) icon.setAttribute("data-lucide", "chevron-down");
    lucide.createIcons();
    return;
  }

  // Cerrar otros abiertos en la misma lista para una experiencia limpia
  const container = row.parentNode;
  container.querySelectorAll(".item-details-expanded").forEach(el => el.remove());
  container.querySelectorAll(".item-row.expanded").forEach(el => {
    el.classList.remove("expanded");
    const icon = el.querySelector(".item-expand-trigger i");
    if (icon) icon.setAttribute("data-lucide", "chevron-down");
  });

  row.classList.add("expanded");
  const icon = row.querySelector(".item-expand-trigger i");
  if (icon) icon.setAttribute("data-lucide", "chevron-up");
  lucide.createIcons();

  // Crear contenedor de detalles
  const detailContainer = document.createElement("div");
  detailContainer.className = "item-details-expanded";
  
  const loading = document.createElement("div");
  loading.className = "loading-spinner";
  loading.textContent = "Cargando estadísticas avanzadas...";
  detailContainer.appendChild(loading);
  
  row.after(detailContainer);

  // Obtener los datos (del item local)
  loadDetailedStats(item, detailContainer);
}

function loadDetailedStats(item, container) {
  try {
    const fromVal = document.getElementById("patch-from").value;
    const toVal = document.getElementById("patch-to").value;
    const itemRecords = wpaData.filter(d => 
      d.id === item.id && 
      d.category === "All Items" && 
      comparePatches(d.patch, fromVal) >= 0 && 
      comparePatches(d.patch, toVal) <= 0
    );

    if (itemRecords.length > 0 && itemRecords.some(r => r.details)) {
      const details = aggregateLocalDetails(itemRecords);
      renderExpandedPanel(container, details);
    } else {
      container.replaceChildren();
      const infoMsg = document.createElement("div");
      infoMsg.className = "error-message";
      infoMsg.style.color = "var(--text-secondary)";
      infoMsg.textContent = "Estadísticas detalladas no disponibles localmente. Ejecuta 'get-wpa.py' y 'process_wpa.py' para descargar y procesar los datos de este ítem.";
      container.appendChild(infoMsg);
    }
  } catch (err) {
    console.error("Error cargando detalles del ítem:", err);
    container.replaceChildren();
    const errMsg = document.createElement("div");
    errMsg.className = "error-message";
    errMsg.textContent = "No se pudieron cargar las estadísticas avanzadas.";
    container.appendChild(errMsg);
  }
}

function aggregateLocalDetails(records) {
  const keysToAggregate = [
    'deltaAgainstMagicDamage', 'deltaAgainstPhysicalDamage', 'deltaAgainstBalancedDamage',
    'deltaWhenHighRange', 'deltaWhenLowRange', 'deltaWhenBalancedRange',
    'deltaWhenTanky', 'deltaWhenSquishy', 'deltaWhenBalancedTankiness',
    'deltaWhenHighCC', 'deltaWhenLowCC', 'deltaWhenNormalCC',
    'deltaWhenGoldAhead', 'deltaWhenGoldBehind', 'deltaWhenGoldBalanced'
  ];
  
  const occurrenceMap = {
    'deltaAgainstMagicDamage': 'magicDamageOccurrence',
    'deltaAgainstPhysicalDamage': 'physicalDamageOccurrence',
    'deltaAgainstBalancedDamage': 'balancedDamageOccurrence',
    'deltaWhenHighRange': 'highRangeOccurrence',
    'deltaWhenLowRange': 'lowRangeOccurrence',
    'deltaWhenBalancedRange': 'balancedRangeOccurrence',
    'deltaWhenTanky': 'tankyOccurrence',
    'deltaWhenSquishy': 'squishyOccurrence',
    'deltaWhenBalancedTankiness': 'balancedTankinessOccurrence',
    'deltaWhenHighCC': 'highCCOccurrence',
    'deltaWhenLowCC': 'lowCCOccurrence',
    'deltaWhenNormalCC': 'normalCCOccurrence',
    'deltaWhenGoldAhead': 'goldAheadOccurrence',
    'deltaWhenGoldBehind': 'goldBehindOccurrence',
    'deltaWhenGoldBalanced': 'goldBalancedOccurrence'
  };

  const result = {};
  keysToAggregate.forEach(key => {
    let weightedSum = 0;
    let totalOccur = 0;
    const occurKey = occurrenceMap[key];

    records.forEach(r => {
      if (r.details) {
        const val = r.details[key];
        const occur = r.details[occurKey] || r.sample_size || 0;
        if (val !== undefined && val !== null) {
          weightedSum += val * occur;
          totalOccur += occur;
        }
      }
    });

    result[key] = totalOccur > 0 ? (weightedSum / totalOccur) : 0;
  });

  return result;
}

function renderExpandedPanel(container, details) {
  container.replaceChildren();

  const title = document.createElement("h4");
  title.textContent = "Rendimiento Avanzado (WPA Added)";
  title.style.marginBottom = "1rem";
  container.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "expanded-grid-full";

  const groups = [
    {
      title: "Por Daño Enemigo",
      metrics: [
        { label: "Físico", val: details.deltaAgainstPhysicalDamage || 0 },
        { label: "Mágico", val: details.deltaAgainstMagicDamage || 0 },
        { label: "Balanceado", val: details.deltaAgainstBalancedDamage || 0 }
      ]
    },
    {
      title: "Por Rango Enemigo",
      metrics: [
        { label: "Alto Rango", val: details.deltaWhenHighRange || 0 },
        { label: "Bajo Rango", val: details.deltaWhenLowRange || 0 },
        { label: "Balanceado", val: details.deltaWhenBalancedRange || 0 }
      ]
    },
    {
      title: "Por Aguante Enemigo",
      metrics: [
        { label: "Tanques", val: details.deltaWhenTanky || 0 },
        { label: "Blandos (Squishy)", val: details.deltaWhenSquishy || 0 },
        { label: "Balanceado", val: details.deltaWhenBalancedTankiness || 0 }
      ]
    },
    {
      title: "Por Control de Masas (CC)",
      metrics: [
        { label: "Alto CC", val: details.deltaWhenHighCC || 0 },
        { label: "Bajo CC", val: details.deltaWhenLowCC || 0 },
        { label: "Normal CC", val: details.deltaWhenNormalCC || 0 }
      ]
    },
    {
      title: "Por Diferencia de Oro",
      metrics: [
        { label: "Con Ventaja", val: details.deltaWhenGoldAhead || 0 },
        { label: "Con Desventaja", val: details.deltaWhenGoldBehind || 0 },
        { label: "Partida Pareja", val: details.deltaWhenGoldBalanced || 0 }
      ]
    }
  ];

  groups.forEach(g => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "metric-group";

    const groupTitle = document.createElement("div");
    groupTitle.className = "metric-group-title";
    groupTitle.textContent = g.title;
    groupDiv.appendChild(groupTitle);

    g.metrics.forEach(m => {
      const row = document.createElement("div");
      row.className = "metric-bar-row";

      const labelSpan = document.createElement("span");
      labelSpan.className = "metric-label";
      labelSpan.textContent = m.label;

      const barWrapper = document.createElement("div");
      barWrapper.className = "metric-bar-wrapper";

      const bar = document.createElement("div");
      bar.className = `metric-bar ${m.val >= 0 ? 'pos' : 'neg'}`;
      
      const percentage = Math.min(Math.abs(m.val) / 5 * 100, 100);
      bar.style.width = `${percentage}%`;

      const valSpan = document.createElement("span");
      valSpan.className = `metric-value ${m.val >= 0 ? 'pos' : 'neg'}`;
      valSpan.textContent = `${m.val >= 0 ? '+' : ''}${m.val.toFixed(2)}%`;

      barWrapper.appendChild(bar);
      row.appendChild(labelSpan);
      row.appendChild(barWrapper);
      row.appendChild(valSpan);
      groupDiv.appendChild(row);
    });

    grid.appendChild(groupDiv);
  });

  container.appendChild(grid);
}

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

function exportLoLItemSet() {
  const selectedChamp = document.getElementById("champion-select").value;
  const championName = selectedChamp === "236" ? "Lucian" : "Smolder";

  // 1. Agregar de 16.9 a 16.16
  const startPatch = "16.9";
  const endPatch = "16.16";
  const granularFiltered = wpaData.filter(d => {
    return comparePatches(d.patch, startPatch) >= 0 && comparePatches(d.patch, endPatch) <= 0;
  });

  const aggregated = {};
  granularFiltered.forEach(r => {
    const key = `${r.category}_${r.id}`;
    if (!aggregated[key]) {
      aggregated[key] = {
        category: r.category,
        id: r.id,
        name: r.name,
        weighted_wpa_sum: 0,
        total_sample: 0,
        records: []
      };
    }
    aggregated[key].total_sample += r.sample_size;
    aggregated[key].weighted_wpa_sum += r.wpa * r.sample_size;
    aggregated[key].records.push(r);
  });

  const list = [];
  for (const key in aggregated) {
    const item = aggregated[key];
    if (item.total_sample >= 1000) {
      let details = null;
      if (item.records.length > 0 && item.records.some(r => r.details)) {
        details = aggregateLocalDetails(item.records);
      }
      list.push({
        category: item.category,
        id: item.id,
        name: item.name,
        wpa: item.weighted_wpa_sum / item.total_sample,
        sample_size: item.total_sample,
        details: details
      });
    }
  }

  // 2. Filtrar y ordenar bloques
  // Bloque: Básicos (Starter con WPA > 0, luego Poción de curación, luego Boots con WPA > 0)
  const starterItems = list.filter(item => item.category === "Starter" && item.wpa > 0);
  starterItems.sort((a, b) => b.wpa - a.wpa);
  
  const bootsItems = list.filter(item => item.category === "Boots" && item.wpa > 0);
  bootsItems.sort((a, b) => b.wpa - a.wpa);

  const basicLoL = [
    ...starterItems.map(item => ({ id: String(item.id), count: 1 })),
    { id: "2003", count: 1 }, // Poción de curación
    ...bootsItems.map(item => ({ id: String(item.id), count: 1 }))
  ];

  // Bloque: Primer item (1st Item con WPA > 0)
  const firstItems = list.filter(item => item.category === "1st Item" && item.wpa > 0);
  firstItems.sort((a, b) => b.wpa - a.wpa);
  const firstLoL = firstItems.map(item => ({ id: String(item.id), count: 1 }));

  // Bloque: Items por WPA (All Items con WPA General > 0, ordenados por WPA general)
  const itemsPorWpa = list.filter(item => item.category === "All Items" && item.wpa > 0);
  itemsPorWpa.sort((a, b) => b.wpa - a.wpa);
  const itemsPorWpaLoL = itemsPorWpa.map(item => ({ id: String(item.id), count: 1 }));

  // Bloques avanzados: All Items con WPA General > 0
  const allItemsWpaPos = list.filter(item => item.category === "All Items" && item.wpa > 0);

  // Helper para generar y ordenar bloques avanzados
  const makeAdvancedBlock = (typeLabel, detailKey) => {
    const valid = allItemsWpaPos.filter(item => item.details && item.details[detailKey] !== undefined && item.details[detailKey] > 0);
    valid.sort((a, b) => b.details[detailKey] - a.details[detailKey]);
    return {
      "type": typeLabel,
      "items": valid.map(item => ({ id: String(item.id), count: 1 })),
      "showIfSummonerSpell": "",
      "hideIfSummonerSpell": "",
      "minSummonerLevel": -1,
      "maxSummonerLevel": -1
    };
  };

  const blocks = [];
  
  if (basicLoL.length > 0) {
    blocks.push({
      "type": "Básicos",
      "items": basicLoL,
      "showIfSummonerSpell": "",
      "hideIfSummonerSpell": "",
      "minSummonerLevel": -1,
      "maxSummonerLevel": -1
    });
  }

  if (firstLoL.length > 0) {
    blocks.push({
      "type": "Primer item",
      "items": firstLoL,
      "showIfSummonerSpell": "",
      "hideIfSummonerSpell": "",
      "minSummonerLevel": -1,
      "maxSummonerLevel": -1
    });
  }

  if (itemsPorWpaLoL.length > 0) {
    blocks.push({
      "type": "Items por WPA",
      "items": itemsPorWpaLoL,
      "showIfSummonerSpell": "",
      "hideIfSummonerSpell": "",
      "minSummonerLevel": -1,
      "maxSummonerLevel": -1
    });
  }

  blocks.push(makeAdvancedBlock("Vs. Daño Mágico", "deltaAgainstMagicDamage"));
  blocks.push(makeAdvancedBlock("Vs. Daño Físico", "deltaAgainstPhysicalDamage"));
  blocks.push(makeAdvancedBlock("Vs. Tanques", "deltaWhenTanky"));
  blocks.push(makeAdvancedBlock("Vs. Blandos (Squishy)", "deltaWhenSquishy"));
  blocks.push(makeAdvancedBlock("Vs. Alto CC", "deltaWhenHighCC"));
  blocks.push(makeAdvancedBlock("Con Ventaja (Ahead)", "deltaWhenGoldAhead"));
  blocks.push(makeAdvancedBlock("Con Desventaja (Behind)", "deltaWhenGoldBehind"));

  // Filtrar bloques vacíos de items
  const finalBlocks = blocks.filter(b => b.items.length > 0);

  const itemSetJson = {
    "title": `Zinkoachless - ${championName}`,
    "associatedChampions": [parseInt(selectedChamp)],
    "associatedMaps": [],
    "blocks": finalBlocks
  };

  const jsonStr = JSON.stringify(itemSetJson, null, 2);

  navigator.clipboard.writeText(jsonStr).then(() => {
    alert(`¡Set de items de League of Legends para ${championName} copiado al portapapeles con éxito!`);
  }).catch(err => {
    console.error("Error al copiar al portapapeles: ", err);
    alert("No se pudo copiar automáticamente. Los datos del Set se han impreso en la consola de desarrollo.");
    console.log(jsonStr);
  });
}
