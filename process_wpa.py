import json
import csv
import requests
from collections import defaultdict

INPUT_FILE = "coachless_champ_236_full_stats.json"
OUTPUT_CSV = "coachless_processed_wpa.csv"
OUTPUT_JSON = "coachless_consolidated_wpa.json"

import os
import time

# IDs conocidos de botas en LoL
BOOTS_IDS = {1001, 3006, 3047, 3158, 3009, 3111, 3117, 3020}

def get_latest_version():
    cache_version_file = os.path.join("data", "raw", "ddragon_latest_version.txt")
    if os.path.exists(cache_version_file):
        try:
            # Si el archivo tiene menos de 24 horas, usarlo directamente
            mtime = os.path.getmtime(cache_version_file)
            if time.time() - mtime < 86400:
                with open(cache_version_file, "r", encoding="utf-8") as f:
                    ver = f.read().strip()
                    if ver:
                        return ver
        except Exception:
            pass

    try:
        url = "https://ddragon.leagueoflegends.com/api/versions.json"
        versions = requests.get(url, timeout=5).json()
        latest = versions[0]
        os.makedirs(os.path.join("data", "raw"), exist_ok=True)
        with open(cache_version_file, "w", encoding="utf-8") as f:
            f.write(latest)
        return latest
    except Exception:
        # Fallback a caché existente o versión estable conocida
        if os.path.exists(cache_version_file):
            try:
                with open(cache_version_file, "r", encoding="utf-8") as f:
                    return f.read().strip()
            except Exception:
                pass
        return "16.19.1"

def fetch_names_mapping(version, locale="es_MX"):
    os.makedirs(os.path.join("data", "raw"), exist_ok=True)
    cache_catalog_file = os.path.join("data", "raw", f"ddragon_catalogs_{locale}_{version}.json")

    # Si ya existe en caché local con datos válidos, cargar en 0ms
    if os.path.exists(cache_catalog_file):
        try:
            with open(cache_catalog_file, "r", encoding="utf-8") as f:
                cached = json.load(f)
                item_map = {int(k): v for k, v in cached.get("items", {}).items()}
                rune_map = {int(k): v for k, v in cached.get("runes", {}).items()}
                summoner_map = {int(k): v for k, v in cached.get("summoners", {}).items()}
                if item_map and rune_map and summoner_map:
                    print(f"Diccionarios DDragon cargados desde caché local ({len(item_map)} objetos, {len(rune_map)} runas, {len(summoner_map)} hechizos).")
                    return item_map, rune_map, summoner_map
        except Exception:
            pass

    print(f"Descargando diccionarios oficiales de DDragon ({version}, {locale})...")
    item_map = {}
    rune_map = {}
    summoner_map = {}

    # 1. Obtener objetos
    try:
        url = f"https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/item.json"
        data = requests.get(url, timeout=10).json()
        for k, v in data.get("data", {}).items():
            item_map[int(k)] = v.get("name")
    except Exception as e:
        print(f"Error fetching items ({locale}): {e}")

    # 2. Obtener runas
    try:
        url = f"https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/runesReforged.json"
        paths = requests.get(url, timeout=10).json()
        for path in paths:
            for slot in path.get("slots", []):
                for rune in slot.get("runes", []):
                    rune_map[int(rune["id"])] = rune.get("name")
    except Exception as e:
        print(f"Error fetching runes ({locale}): {e}")

    # 3. Obtener summoners
    try:
        url = f"https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/summoner.json"
        data = requests.get(url, timeout=10).json()
        for k, v in data.get("data", {}).items():
            summoner_map[int(v["key"])] = v.get("name")
    except Exception as e:
        print(f"Error fetching summoners ({locale}): {e}")

    # Mappings heredados de ítems eliminados de versiones recientes de DDragon (ej. 3097 = Navaja de la Tormenta)
    legacy_items = {
        3097: "Navaja de la Tormenta" if locale.startswith("es") else "Stormrazor"
    }
    for k, v in legacy_items.items():
        if k not in item_map:
            item_map[k] = v

    # Guardar en disco local para que todas las futuras ejecuciones sean instantáneas
    if item_map and rune_map and summoner_map:
        try:
            with open(cache_catalog_file, "w", encoding="utf-8") as f:
                json.dump({
                    "version": version,
                    "locale": locale,
                    "items": item_map,
                    "runes": rune_map,
                    "summoners": summoner_map
                }, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Advertencia al guardar caché de DDragon: {e}")

    return item_map, rune_map, summoner_map

def parse_wpa_entry(entry, category, patch_version, item_map, rune_map, summoner_map):
    """
    Extrae y normaliza un registro individual.
    """
    # Identificar el ID dependiendo de la sección
    item_id = (
        entry.get("id") or 
        entry.get("itemId") or 
        entry.get("rune") or 
        entry.get("summonerSpell")
    )
    
    if item_id is not None:
        item_id = int(item_id)

    # Buscar nombre según la categoría
    name = entry.get("name")
    if not name and item_id is not None:
        if category in {"Keystone"}:
            name = rune_map.get(item_id)
        elif category in {"Spell"}:
            name = summoner_map.get(item_id)
        else:
            name = item_map.get(item_id)
    
    if not name:
        name = f"ID_{item_id}"

    # WPA y sample
    wpa = entry.get("winProbabilityAdded", entry.get("wpaOverall", 0.0))
    sample = entry.get("pickCount", entry.get("buyCount", entry.get("occurrence", 0)))

    # Determinar si la categoría Boots / Starter debe dividirse
    final_category = category
    if category == "Boots / Starter":
        if item_id in BOOTS_IDS:
            final_category = "Boots"
        else:
            final_category = "Starter"

    return {
        "patch": patch_version,
        "category": final_category,
        "id": item_id,
        "name": name,
        "wpa": round(float(wpa), 4) if wpa is not None else 0.0,
        "sample_size": int(sample) if sample is not None else 0
    }

def process_coachless_json(input_file, output_granular_json, item_map, rune_map, summoner_map, item_history):
    try:
        with open(input_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {input_file} no encontrado.")
        return

    category_mapping = {
        "keystones": "Keystone",
        "summoner_spells": "Spell",
        "starters": "Starter",
        "boots": "Boots",
        "item_slot_1": "1st Item",
        "item_slot_2": "2nd Item",
        "item_slot_3": "3rd Item",
        "late_game_items": "4th+ Item",
        "items_no_slot": "All Items"
    }

    records = []

    for patch, sections in raw_data.items():
        if not sections:
            continue
        for section_key, cat_name in category_mapping.items():
            section_content = sections.get(section_key)
            if not section_content:
                continue

            # Si es una lista o dict
            items_list = section_content if isinstance(section_content, list) else section_content.get("statistics", section_content.get("items", []))

            for entry in items_list:
                parsed = parse_wpa_entry(entry, cat_name, patch, item_map, rune_map, summoner_map)
                
                # Asignar último parche modificado
                if parsed["id"] is not None:
                    item_id_str = str(parsed["id"])
                    if item_id_str in item_history:
                        parsed["last_changed_patch"] = item_history[item_id_str].get("last_changed_patch", "16.1")
                    else:
                        parsed["last_changed_patch"] = "16.1"

                records.append(parsed)

    # Exportar registros individuales a JSON Granular compacto en docs/data/granular/
    if not records:
        print(f"Omitiendo exportación: 0 registros válidos en '{input_file}' (se preservan datos previos en '{output_granular_json}').")
        return

    os.makedirs(os.path.dirname(output_granular_json), exist_ok=True)
    with open(output_granular_json, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, separators=(',', ':'))
    print(f"JSON granular exportado: {len(records)} registros guardados en '{output_granular_json}'.")

if __name__ == "__main__":
    import glob
    import re
    import os
    import shutil
    
    docs_granular_dir = os.path.join("docs", "data", "granular")
    os.makedirs(docs_granular_dir, exist_ok=True)
    
    print("Obteniendo última versión de DDragon...")
    latest_version = get_latest_version()
    print(f"Versión seleccionada: {latest_version}")
    
    print("Descargando traducciones de objetos, runas y hechizos una sola vez...")
    item_map, rune_map, summoner_map = fetch_names_mapping(latest_version)

    # Cargar historial de cambios de parches
    item_history = {}
    history_file = os.path.join("data", "processed", "item_patch_history.json")
    if os.path.exists(history_file):
        try:
            with open(history_file, "r", encoding="utf-8") as f:
                item_history = json.load(f)
        except Exception as e:
            print(f"Advertencia al leer {history_file}: {e}")

    # Escanear archivos de estadísticas de campeones en data/raw/
    processed_keys = []
    for filepath in sorted(glob.glob(os.path.join("data", "raw", "coachless_champ_*_full_stats.json"))):
        match_role = re.search(r"coachless_champ_(\d+)_role_(\d+)_full_stats.json", filepath)
        match_base = re.search(r"coachless_champ_(\d+)_full_stats.json", filepath)
        
        if match_role:
            champ_id = match_role.group(1)
            champ_role = match_role.group(2)
            key_name = f"{champ_id}_role_{champ_role}"
        elif match_base:
            champ_id = match_base.group(1)
            key_name = champ_id
        else:
            continue
            
        output_granular_json = os.path.join(docs_granular_dir, f"coachless_granular_wpa_{key_name}.json")
        
        print(f"\n---> Procesando estadísticas: {key_name}")
        process_coachless_json(filepath, output_granular_json, item_map, rune_map, summoner_map, item_history)
        processed_keys.append(key_name)
            
    print(f"\n=== Todos los datos procesados ({len(processed_keys)} perfiles) y exportados a 'docs/data/granular/' para GitHub Pages ===")
    
    # Sincronizar archivo de configuración central con docs/data/config.json
    if os.path.exists("config.json"):
        shutil.copyfile("config.json", os.path.join("docs", "data", "config.json"))
        print(f"---> Configuración sincronizada en 'docs/data/config.json'.")
