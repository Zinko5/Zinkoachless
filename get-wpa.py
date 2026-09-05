import requests
import json
import time
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://api.coachless.gg"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://coachless.gg",
    "Referer": "https://coachless.gg/"
}

# Sesión reutilizable para HTTP Keep-Alive
session = requests.Session()
session.headers.update(HEADERS)

def build_common_filters(major, patch, champion_id=236, role=3):
    return {
        "patch": {"major": major, "patch": patch, "patchAdditions": 0},
        "championIds": [champion_id],
        "matchupChampionIds": None,
        "leagueTiers": [5, 6, 7],
        "regions": None,
        "role": role
    }

def fetch_keystones(common_filters):
    url = f"{BASE_URL}/api/Rune/GetKeystoneData"
    payload = {"commonFilters": common_filters}
    res = session.post(url, json=payload, timeout=30)
    return res.json() if res.status_code == 200 else None

def fetch_summoners(common_filters):
    url = f"{BASE_URL}/api/ChampionWinprob/GetGlobalSummonerSpellStatistics"
    payload = {"commonFilters": common_filters, "pairedSpell": None}
    res = session.post(url, json=payload, timeout=30)
    return res.json() if res.status_code == 200 else None

def fetch_items(common_filters, slots=None, item_type=1, is_support=False):
    url = f"{BASE_URL}/api/ChampionWinprob/GetGlobalItemStatistics"
    payload = {
        "commonFilters": common_filters,
        "itemSlots": slots,
        "itemType": item_type,
        "keystone": None,
        "starterId": None,
        "firstPurchaseId": None,
        "firstLegendaryId": None,
        "secondLegendaryId": None,
        "loadFirstEpicPurchase": False,
        "includeSupportItems": is_support
    }
    res = session.post(url, json=payload, timeout=30)
    return res.json() if res.status_code == 200 else None

def fetch_item_detailed(common_filters, item_id):
    url = f"{BASE_URL}/api/ChampionWinprob/GetItemDetailed"
    payload = {
        "commonFilters": common_filters,
        "itemId": item_id,
        "itemType": 1,
        "itemSlots": None,
        "keystone": None,
        "starterId": None,
        "firstPurchaseId": None,
        "firstLegendaryId": None,
        "secondLegendaryId": None
    }
    res = session.post(url, json=payload, timeout=30)
    return res.json() if res.status_code == 200 else None

def safe_fetch(func, *args, **kwargs):
    try:
        return func(*args, **kwargs)
    except Exception as e:
        time.sleep(0.5)
        try:
            return func(*args, **kwargs)
        except Exception:
            return None

# Configuración de extracción
CHAMPIONS = [
    # {"id": 236, "role": 3},  # Lucian (Bot/ADC)
    # {"id": 901, "role": 3},  # Smolder (Bot/ADC)
    # {"id": 245, "role": 1},  # Ekko (Jungla)
    # {"id": 245, "role": 2},  # Ekko (Mid)
    # {"id": 887, "role": 1},  # Gwen (Jungla)
    # {"id": 887, "role": 2},  # Gwen (Mid)
    # {"id": 106, "role": 0},  # Volibear (Top)
    # {"id": 106, "role": 1},  # Volibear (Jungla)
    # {"id": 1, "role": 2},    # Annie (Mid)
    # {"id": 19, "role": 0},   # Warwick (Top)
    # {"id": 19, "role": 1},   # Warwick (Jungla)
    # {"id": 9, "role": 1},    # Fiddlesticks (Jungla)
    # {"id": 234, "role": 1},  # Viego (Jungla)
    # {"id": 360, "role": 3},  # Samira (Bot/ADC)
    # {"id": 233, "role": 1},  # Briar (Jungla)
    # {"id": 35, "role": 1},   # Shaco (Jungla)
    # {"id": 104, "role": 1},  # Graves (Jungla)
    # {"id": 84, "role": 0},   # Akali (Top)
    # {"id": 84, "role": 2},   # Akali (Mid)
    # {"id": 99, "role": 3},   # Lux (Bot/ADC)
    # {"id": 99, "role": 2},   # Lux (Mid)
    # {"id": 99, "role": 4},   # Lux (Support)
    # {"id": 86, "role": 0},   # Garen (Top)
    # {"id": 36, "role": 0},   # DrMundo (Top)
    # {"id": 36, "role": 1},   # DrMundo (Jungla)
    # {"id": 147, "role": 2},  # Seraphine (Mid)
    # {"id": 147, "role": 3},  # Seraphine (Bot/ADC)
    # {"id": 147, "role": 4},  # Seraphine (Support)
    # {"id": 105, "role": 2},  # Fizz (Mid)
    # {"id": 26, "role": 4},   # Zilean (Support)
    # {"id": 895, "role": 3},  # Nilah (Bot/ADC)
    # {"id": 518, "role": 4},  # Neeko (Support)
    # {"id": 28, "role": 1},   # Evelynn (Jungla)
    # {"id": 45, "role": 2},   # Veigar (Mid)
    # {"id": 63, "role": 3},   # Brand (Bot/ADC)
    # {"id": 63, "role": 4},   # Brand (Support)
    # {"id": 223, "role": 0},  # Tahm Kench (Top)
    # {"id": 223, "role": 4},  # Tahm Kench (Support)
    # {"id": 17, "role": 0},   # Teemo (Top)
    # {"id": 23, "role": 0},   # Tryndamere (Top)
    # {"id": 1, "role": 4},    # Annie (Support)
    # {"id": 8, "role": 2},    # Vladimir (Mid)
    # {"id": 50, "role": 3},   # Swain (Bot/ADC)
    # {"id": 119, "role": 3},  # Draven (Bot/ADC)
    # {"id": 18, "role": 3}    # Tristana (Bot/ADC)
    {"id": 222, "role": 3}    # Jinx (Bot/ADC)
]
MAJOR = 16              # Season
PATCHES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

latest_patch_num = max(PATCHES) if PATCHES else None

for champ in CHAMPIONS:
    champ_id = champ["id"]
    champ_role = champ["role"]
    print(f"\n=========================================")
    print(f"Iniciando extracción rápida para Campeón ID: {champ_id} (Rol: {champ_role})")
    print(f"=========================================")
    
    os.makedirs(os.path.join("data", "raw"), exist_ok=True)
    filename = os.path.join("data", "raw", f"coachless_champ_{champ_id}_role_{champ_role}_full_stats.json")
    resultado_final = {}
    
    if os.path.exists(filename):
        try:
            with open(filename, "r", encoding="utf-8") as f:
                resultado_final = json.load(f)
            print(f"-> Cargados datos existentes de {len(resultado_final)} parches desde {filename}.")
        except Exception as e:
            print(f"-> Error al leer el archivo existente (se creará nuevo): {e}")

    for patch in PATCHES:
        patch_key = f"{MAJOR}.{patch}"
        
        if patch_key in resultado_final and patch != latest_patch_num:
            if resultado_final[patch_key] and "items_no_slot" in resultado_final[patch_key] and resultado_final[patch_key]["items_no_slot"] and "item_details" in resultado_final[patch_key]:
                print(f"  [✓] Parche {patch_key} ya existe. Omitiendo descarga.")
                continue

        if patch == latest_patch_num:
            print(f"--- Actualizando Parche Actual {patch_key} ---")
        else:
            print(f"--- Extrayendo Nuevo Parche {patch_key} ---")
            
        cf = build_common_filters(MAJOR, patch, champ_id, champ_role)
        
        # 1. Peticiones de categorías en paralelo (8 peticiones concurrentes)
        categories_tasks = {
            "keystones": (fetch_keystones, (cf,)),
            "summoner_spells": (fetch_summoners, (cf,)),
            "starters": (fetch_items, (cf, None, 6)),
            "boots": (fetch_items, (cf, None, 2)),
            "item_slot_1": (fetch_items, (cf, [1], 1)),
            "item_slot_2": (fetch_items, (cf, [2], 1)),
            "item_slot_3": (fetch_items, (cf, [3], 1)),
            "late_game_items": (fetch_items, (cf, [4, 5, 6], 1)),
            "items_no_slot": (fetch_items, (cf, None, 1))
        }

        patch_data = {}
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_cat = {executor.submit(safe_fetch, func, *args): cat for cat, (func, args) in categories_tasks.items()}
            for future in as_completed(future_to_cat):
                cat = future_to_cat[future]
                patch_data[cat] = future.result()

        # 2. Peticiones concurrentes de detalles de cada ítem
        items_no_slot = patch_data.get("items_no_slot")
        item_details = {}
        if items_no_slot:
            items_list = items_no_slot if isinstance(items_no_slot, list) else items_no_slot.get("statistics", items_no_slot.get("items", []))
            item_ids = []
            for item in items_list:
                item_id = item.get("itemId") or item.get("id")
                if item_id:
                    item_ids.append(int(item_id))

            if item_ids:
                print(f"    -> Extrayendo detalles concurrentes para {len(item_ids)} ítems...")
                with ThreadPoolExecutor(max_workers=10) as executor:
                    future_to_id = {executor.submit(safe_fetch, fetch_item_detailed, cf, i_id): i_id for i_id in item_ids}
                    for future in as_completed(future_to_id):
                        i_id = future_to_id[future]
                        detailed = future.result()
                        item_details[str(i_id)] = {"detailed": detailed}

        patch_data["item_details"] = item_details
        resultado_final[patch_key] = patch_data

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(resultado_final, f, ensure_ascii=False, indent=2)
    print(f"Datos guardados con éxito en {filename}")