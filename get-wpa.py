import requests
import json
import time
import os
import random
import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://api.coachless.gg"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://coachless.gg",
    "Referer": "https://coachless.gg/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site"
}

# Sesión reutilizable con HTTP Keep-Alive
session = requests.Session()
session.headers.update(HEADERS)

# Mapeo exacto de roles en la API de Coachless:
# 0: Top, 1: Jungla, 2: Mid, 3: Bot, 4: Support (5 es la suma global de todos los roles)
COACHLESS_ROLE_MAP = {
    0: 0,  # Top
    1: 1,  # Jungla
    2: 2,  # Mid
    3: 3,  # Bot
    4: 4   # Support
}

def build_common_filters(major, patch, champion_id=236, role=3):
    api_role = COACHLESS_ROLE_MAP.get(role, role)
    return {
        "patch": {"major": major, "patch": patch, "patchAdditions": 0},
        "championIds": [champion_id],
        "matchupChampionIds": None,
        "leagueTiers": [5, 6, 7],
        "regions": None,
        "role": api_role
    }

import threading

# Control global de tasa y bloqueo sincronizado de 429 entre hilos
rate_limit_lock = threading.Lock()
rate_limit_until = 0.0
last_request_time = 0.0

def make_api_request(url, payload):
    """
    Realiza una petición POST con pacing global centralizado (~2.8 req/s) y pausa unificada ante 429.
    """
    global rate_limit_until, last_request_time
    
    for attempt in range(4):
        # 1. Si hay un enfriamiento 429 activo, esperar a que expire
        with rate_limit_lock:
            now = time.time()
            sleep_needed = max(0.0, rate_limit_until - now)
        if sleep_needed > 0:
            time.sleep(sleep_needed)

        # 2. Pacing global preventivo (mínimo 0.35s entre peticiones a nivel de todo el script)
        with rate_limit_lock:
            now = time.time()
            elapsed = now - last_request_time
            if elapsed < 0.35:
                time.sleep(0.35 - elapsed)
            last_request_time = time.time()

        try:
            res = session.post(url, json=payload, timeout=30)
            if res.status_code == 200:
                return res.json()
            elif res.status_code == 429:
                with rate_limit_lock:
                    now = time.time()
                    if now >= rate_limit_until:
                        wait_sec = 75.0
                        try:
                            data = res.json()
                            if "retryAt" in data:
                                retry_ts = data["retryAt"].replace("Z", "+00:00")
                                retry_dt = datetime.datetime.fromisoformat(retry_ts)
                                now_dt = datetime.datetime.now(datetime.timezone.utc)
                                diff = (retry_dt - now_dt).total_seconds()
                                if diff > 0:
                                    wait_sec = round(diff + 5.0, 1)
                        except Exception:
                            pass

                        rate_limit_until = now + wait_sec
                        wait_min = round(wait_sec / 60.0, 1)
                        print(f"\n[!] Servidor de Coachless devolvió 429 (Cuota de IP). Pausando {wait_sec}s (~{wait_min} min)...")
                        if wait_sec > 90:
                            print(f"    (Tip: Si tienes VPN activada, puedes cambiar de ubicación de servidor para obtener una IP nueva y continuar de inmediato).")
                continue
            else:
                return None
        except Exception:
            time.sleep(1.0)
    return None

def fetch_keystones(common_filters):
    return make_api_request(f"{BASE_URL}/api/Rune/GetKeystoneData", {"commonFilters": common_filters})

def fetch_summoners(common_filters):
    return make_api_request(f"{BASE_URL}/api/ChampionWinprob/GetGlobalSummonerSpellStatistics", {"commonFilters": common_filters, "pairedSpell": None})

def fetch_items(common_filters, slots=None, item_type=1, is_support=False):
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
    return make_api_request(f"{BASE_URL}/api/ChampionWinprob/GetGlobalItemStatistics", payload)

def safe_fetch(func, *args, **kwargs):
    try:
        return func(*args, **kwargs)
    except Exception:
        return None

# Cargar configuración centralizada
CONFIG_FILE = "config.json"
MAJOR = 16
PATCHES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
CHAMPIONS = []

if os.path.exists(CONFIG_FILE):
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            cfg = json.load(f)
            MAJOR = cfg.get("season", MAJOR)
            PATCHES = cfg.get("patches", PATCHES)
            for c in cfg.get("champions", []):
                c_id = c["id"]
                c_name = c.get("name", str(c_id))
                for r in c.get("roles", [3]):
                    CHAMPIONS.append({"id": c_id, "role": r, "name": c_name})
    except Exception as e:
        print(f"Error al leer {CONFIG_FILE}: {e}")

if not CHAMPIONS:
    CHAMPIONS = [{"id": 236, "role": 3, "name": "Lucian"}]

import argparse

parser = argparse.ArgumentParser(description="Extracción y caché de estadísticas de Coachless.")
parser.add_argument("--exclude-latest", "-e", action="store_true",
                    help="Descarga solo hasta el penúltimo parche listado en config.json y omite campeones ya registrados (0s).")
parser.add_argument("--skip-existing", "-s", "--no-update", action="store_true",
                    help="Omite la comprobación de actualizaciones si el campeón ya tiene datos locales.")
args, unknown = parser.parse_known_args()

if args.exclude_latest:
    if len(PATCHES) > 1:
        TARGET_PATCHES = PATCHES[:-1]
    else:
        TARGET_PATCHES = PATCHES
    update_latest = False
    print(f"\n[MODO: --exclude-latest] Omitiendo último parche ({max(PATCHES)}). Parches objetivo: {min(TARGET_PATCHES)} a {max(TARGET_PATCHES)}.")
    print("                       No se comprobarán actualizaciones en perfiles ya registrados.")
elif args.skip_existing:
    TARGET_PATCHES = PATCHES
    update_latest = False
    print(f"\n[MODO: --skip-existing] No se comprobarán actualizaciones en campeones que ya tengan datos locales.")
else:
    TARGET_PATCHES = PATCHES
    update_latest = True

latest_patch_num = max(TARGET_PATCHES) if TARGET_PATCHES else None
total_champs = len(CHAMPIONS)

print(f"\n=== Iniciando Extracción Ponderada ({total_champs} perfiles de campeones) ===")
print(f"Temporada: {MAJOR} | Parches: {min(TARGET_PATCHES)} a {max(TARGET_PATCHES)} | Ritmo: Pacing Preventivo (~4 req/s)\n")

for idx, champ in enumerate(CHAMPIONS, 1):
    champ_id = champ["id"]
    champ_role = champ["role"]
    champ_name = champ.get("name", str(champ_id))
    
    os.makedirs(os.path.join("data", "raw"), exist_ok=True)
    filename = os.path.join("data", "raw", f"coachless_champ_{champ_id}_role_{champ_role}_full_stats.json")
    resultado_final = {}
    
    if os.path.exists(filename):
        try:
            with open(filename, "r", encoding="utf-8") as f:
                resultado_final = json.load(f)
        except Exception:
            resultado_final = {}

    # Determinar qué parches faltan por descargar
    patches_to_fetch = []
    for patch in TARGET_PATCHES:
        patch_key = f"{MAJOR}.{patch}"
        p_val = resultado_final.get(patch_key)
        has_data = p_val and p_val.get("items_no_slot")
        
        if patch == latest_patch_num and update_latest:
            patches_to_fetch.append(patch)
        elif not has_data:
            patches_to_fetch.append(patch)

    if not patches_to_fetch:
        print(f"[{idx}/{total_champs}] {champ_name} (ID: {champ_id}, Rol: {champ_role}) -> Ya completado (omitido en 0s)")
        continue

    print(f"[{idx}/{total_champs}] {champ_name} (ID: {champ_id}, Rol: {champ_role}) -> Faltan {len(patches_to_fetch)} parches")

    for patch in patches_to_fetch:
        patch_key = f"{MAJOR}.{patch}"
        
        if patch == latest_patch_num and update_latest:
            print(f"  -> Actualizando Parche Actual {patch_key}...")
        else:
            print(f"  -> Extrayendo Parche {patch_key}...")
            
        cf = build_common_filters(MAJOR, patch, champ_id, champ_role)
        
        # 1. Peticiones de categorías con concurrencia controlada (2 hilos para estabilidad)
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
        with ThreadPoolExecutor(max_workers=2) as executor:
            future_to_cat = {executor.submit(safe_fetch, func, *args): cat for cat, (func, args) in categories_tasks.items()}
            for future in as_completed(future_to_cat):
                cat = future_to_cat[future]
                patch_data[cat] = future.result()

        # Validar que obtuvimos datos antes de guardar
        has_valid = any(v is not None for v in patch_data.values())
        if has_valid:
            resultado_final[patch_key] = patch_data
            
            # Checkpoint atómico: guardar progreso inmediatamente en disco
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(resultado_final, f, ensure_ascii=False, indent=2)

    # Resumen final por campeón
    total_valid_patches = sum(1 for p in resultado_final.values() if p and p.get("items_no_slot"))
    if total_valid_patches > 0:
        print(f"  [✓] {champ_name} completado ({total_valid_patches}/{len(TARGET_PATCHES)} parches guardados en disco).\n")
    else:
        print(f"  [!] Sin datos nuevos para {champ_name}.\n")