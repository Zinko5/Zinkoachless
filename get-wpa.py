import requests
import json
import time

BASE_URL = "https://api.coachless.gg"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://coachless.gg",
    "Referer": "https://coachless.gg/"
}

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
    res = requests.post(url, headers=HEADERS, json=payload, timeout=30)
    return res.json() if res.status_code == 200 else None

def fetch_summoners(common_filters):
    url = f"{BASE_URL}/api/ChampionWinprob/GetGlobalSummonerSpellStatistics"
    payload = {"commonFilters": common_filters, "pairedSpell": None}
    res = requests.post(url, headers=HEADERS, json=payload, timeout=30)
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
    res = requests.post(url, headers=HEADERS, json=payload, timeout=30)
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
    res = requests.post(url, headers=HEADERS, json=payload, timeout=30)
    return res.json() if res.status_code == 200 else None

def safe_fetch(func, *args, **kwargs):
    try:
        return func(*args, **kwargs)
    except Exception as e:
        print(f"  [!] Falló intento 1 ({e}). Reintentando en 1.5 segundos...")
        time.sleep(1.5)
        try:
            return func(*args, **kwargs)
        except Exception as e2:
            print(f"  [X] Falló intento 2 ({e2}). Saltando esta sección.")
            return None

import os

# Configuración de extracción
CHAMPIONS = [
    {"id": 236, "role": 3},  # Lucian (Bot/ADC)
    {"id": 901, "role": 3},  # Smolder (Bot/ADC)
    {"id": 245, "role": 1},  # Ekko (Jungla)
    {"id": 245, "role": 2},  # Ekko (Mid)
    {"id": 887, "role": 1},  # Gwen (Jungla)
    {"id": 106, "role": 1}   # Volibear (Jungla)
]
MAJOR = 16              # Season
PATCHES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

# Determinar el último parche en el array PATCHES para forzar su actualización
latest_patch_num = max(PATCHES) if PATCHES else None

for champ in CHAMPIONS:
    champ_id = champ["id"]
    champ_role = champ["role"]
    print(f"\n=========================================")
    print(f"Iniciando extracción para Campeón ID: {champ_id} (Rol: {champ_role})")
    print(f"=========================================")
    
    os.makedirs(os.path.join("data", "raw"), exist_ok=True)
    filename = os.path.join("data", "raw", f"coachless_champ_{champ_id}_role_{champ_role}_full_stats.json")
    legacy_filename = os.path.join("data", "raw", f"coachless_champ_{champ_id}_full_stats.json")
    resultado_final = {}
    
    # Intentar cargar datos existentes específicos para este rol
    if os.path.exists(filename):
        try:
            with open(filename, "r", encoding="utf-8") as f:
                resultado_final = json.load(f)
            print(f"-> Cargados datos existentes de {len(resultado_final)} parches desde {filename}.")
        except Exception as e:
            print(f"-> Error al leer el archivo existente (se creará nuevo): {e}")

    for patch in PATCHES:
        patch_key = f"{MAJOR}.{patch}"
        
        # Comprobar si ya existe y si NO es el parche más reciente, y si ya tiene la clave items_no_slot e item_details
        if patch_key in resultado_final and patch != latest_patch_num:
            # Asegurar que tiene información cargada y que incluye la nueva clave
            if resultado_final[patch_key] and "items_no_slot" in resultado_final[patch_key] and resultado_final[patch_key]["items_no_slot"] and "item_details" in resultado_final[patch_key]:
                print(f"  [✓] Parche {patch_key} ya existe con items_no_slot e item_details. Omitiendo descarga.")
                continue

        if patch == latest_patch_num:
            print(f"--- Actualizando Parche Actual {patch_key} ---")
        else:
            print(f"--- Extrayendo Nuevo Parche {patch_key} ---")
            
        cf = build_common_filters(MAJOR, patch, champ_id, champ_role)
        
        items_no_slot = safe_fetch(fetch_items, cf, slots=None, item_type=1)
        
        item_details = {}
        if items_no_slot:
            items_list = items_no_slot if isinstance(items_no_slot, list) else items_no_slot.get("statistics", items_no_slot.get("items", []))
            for item in items_list:
                item_id = item.get("itemId") or item.get("id")
                if item_id:
                    item_id = int(item_id)
                    print(f"    -> Extrayendo detalles para ítem ID: {item_id}")
                    detailed = safe_fetch(fetch_item_detailed, cf, item_id)
                    item_details[str(item_id)] = {
                        "detailed": detailed
                    }
                    time.sleep(0.1)

        resultado_final[patch_key] = {
            "keystones": safe_fetch(fetch_keystones, cf),
            "summoner_spells": safe_fetch(fetch_summoners, cf),
            "starters": safe_fetch(fetch_items, cf, slots=None, item_type=6),
            "boots": safe_fetch(fetch_items, cf, slots=None, item_type=2),
            "item_slot_1": safe_fetch(fetch_items, cf, slots=[1], item_type=1),
            "item_slot_2": safe_fetch(fetch_items, cf, slots=[2], item_type=1),
            "item_slot_3": safe_fetch(fetch_items, cf, slots=[3], item_type=1),
            "late_game_items": safe_fetch(fetch_items, cf, slots=[4, 5, 6], item_type=1),
            "items_no_slot": items_no_slot,
            "item_details": item_details
        }
        time.sleep(0.5)

    # Guardar en disco
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(resultado_final, f, ensure_ascii=False, indent=2)
    print(f"Datos guardados con éxito en {filename}")