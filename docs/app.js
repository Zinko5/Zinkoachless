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

  // Ordenar por WPA o cantidad de compras según selección activa
  if (currentSort === 'wpa') {
    items.sort((a, b) => b.wpa - a.wpa);
  } else {
    items.sort((a, b) => b.sample_size - a.sample_size);
  }

  items.forEach(item => {
    const sign = item.wpa >= 0 ? "+" : "";
    const wpaClass = item.wpa >= 0 ? "wpa-positive" : "wpa-negative";
    const iconUrl = getImageUrl(item);
    
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <div class="item-icon">
        <img src="${iconUrl}" alt="${item.name}" onerror="this.src='https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${item.id}.png'">
      </div>
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-subtext">ID: ${item.id}</div>
      </div>
      <div class="item-stats">
        <div class="wpa-value ${wpaClass}">${sign}${item.wpa.toFixed(2)}%</div>
        <div class="buys-count">${formatNumber(item.sample_size)}</div>
      </div>
    `;
    container.appendChild(row);
  });
}

function applyFilters() {
  const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();
  const wpaFilterValue = document.getElementById("wpa-filter").value;
  
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
        total_sample: 0
      };
    }
    aggregated[key].total_sample += r.sample_size;
    aggregated[key].weighted_wpa_sum += r.wpa * r.sample_size;
  });

  // Convertir a lista y calcular promedios
  const aggregatedList = [];
  for (const key in aggregated) {
    const item = aggregated[key];
    if (item.total_sample > 0) {
      aggregatedList.push({
        category: item.category,
        id: item.id,
        name: item.name,
        wpa: item.weighted_wpa_sum / item.total_sample,
        sample_size: item.total_sample
      });
    }
  }

  // 3. Aplicar filtros de búsqueda y WPA sobre los agregados
  let filtered = aggregatedList.filter(item => {
    // Filtro de búsqueda
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery) && !String(item.id).includes(searchQuery)) {
      return false;
    }

    // Filtro de WPA
    if (wpaFilterValue === "positive" && item.wpa < 0) return false;
    if (wpaFilterValue === "negative" && item.wpa > 0) return false;

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
    "4th+ Item": "list-4th-Item"
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
  // Intentar obtener la versión más reciente de DDragon y mapear runas dinámicamente
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
    }
  } catch (e) {
    console.warn("Could not fetch DDragon versions or runes dynamically:", e);
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
      document.getElementById("wpa-filter").value = "all";
      applyFilters();
    }
  });

  // Click en cabeceras de columnas (WPA / Compras) para alternar ordenamiento
  document.querySelectorAll('.sort-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      const sortType = e.target.getAttribute('data-sort');
      currentSort = sortType;
      
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
