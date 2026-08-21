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
CHAMPIONS = [236, 901]  # Lucian y Smolder
ROLE = 3                # Rol (ADC / Bot)
MAJOR = 16              # Season
PATCHES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

# Determinar el último parche en el array PATCHES para forzar su actualización
latest_patch_num = max(PATCHES) if PATCHES else None

for champ_id in CHAMPIONS:
    print(f"\n=========================================")
    print(f"Iniciando extracción para Campeón ID: {champ_id}")
    print(f"=========================================")
    
    os.makedirs(os.path.join("data", "raw"), exist_ok=True)
    filename = os.path.join("data", "raw", f"coachless_champ_{champ_id}_full_stats.json")
    resultado_final = {}
    
    # Intentar cargar datos existentes
    if os.path.exists(filename):
        try:
            with open(filename, "r", encoding="utf-8") as f:
                resultado_final = json.load(f)
            print(f"-> Cargados datos existentes de {len(resultado_final)} parches desde {filename}.")
        except Exception as e:
            print(f"-> Error al leer el archivo existente (se creará nuevo): {e}")

    for patch in PATCHES:
        patch_key = f"{MAJOR}.{patch}"
        
        # Comprobar si ya existe y si NO es el parche más reciente, y si ya tiene la clave items_no_slot
        if patch_key in resultado_final and patch != latest_patch_num:
            # Asegurar que tiene información cargada y que incluye la nueva clave
            if resultado_final[patch_key] and "items_no_slot" in resultado_final[patch_key] and resultado_final[patch_key]["items_no_slot"]:
                print(f"  [✓] Parche {patch_key} ya existe con items_no_slot. Omitiendo descarga.")
                continue

        if patch == latest_patch_num:
            print(f"--- Actualizando Parche Actual {patch_key} ---")
        else:
            print(f"--- Extrayendo Nuevo Parche {patch_key} ---")
            
        cf = build_common_filters(MAJOR, patch, champ_id, ROLE)
        
        resultado_final[patch_key] = {
            "keystones": safe_fetch(fetch_keystones, cf),
            "summoner_spells": safe_fetch(fetch_summoners, cf),
            "starters": safe_fetch(fetch_items, cf, slots=None, item_type=6),
            "boots": safe_fetch(fetch_items, cf, slots=None, item_type=2),
            "item_slot_1": safe_fetch(fetch_items, cf, slots=[1], item_type=1),
            "item_slot_2": safe_fetch(fetch_items, cf, slots=[2], item_type=1),
            "item_slot_3": safe_fetch(fetch_items, cf, slots=[3], item_type=1),
            "late_game_items": safe_fetch(fetch_items, cf, slots=[4, 5, 6], item_type=1),
            "items_no_slot": safe_fetch(fetch_items, cf, slots=None, item_type=1)
        }
        time.sleep(0.5)

    # Guardar en disco
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(resultado_final, f, ensure_ascii=False, indent=2)
    print(f"Datos guardados con éxito en {filename}")