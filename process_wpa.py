import json
import csv
import requests
from collections import defaultdict

INPUT_FILE = "coachless_champ_236_full_stats.json"
OUTPUT_CSV = "coachless_processed_wpa.csv"
OUTPUT_JSON = "coachless_consolidated_wpa.json"

# IDs conocidos de botas en LoL
BOOTS_IDS = {1001, 3006, 3047, 3158, 3009, 3111, 3117, 3020}

def get_latest_version():
    try:
        url = "https://ddragon.leagueoflegends.com/api/versions.json"
        versions = requests.get(url, timeout=5).json()
        return versions[0]
    except Exception:
        return "14.22.1"  # Fallback a una versión conocida estable

def fetch_names_mapping(version):
    item_map = {}
    rune_map = {}
    summoner_map = {}

    # 1. Obtener objetos
    try:
        url = f"https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/item.json"
        data = requests.get(url, timeout=5).json()
        for k, v in data.get("data", {}).items():
            item_map[int(k)] = v.get("name")
    except Exception as e:
        print(f"Error fetching items: {e}")

    # 2. Obtener runas
    try:
        url = f"https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/runesReforged.json"
        paths = requests.get(url, timeout=5).json()
        for path in paths:
            for slot in path.get("slots", []):
                for rune in slot.get("runes", []):
                    rune_map[int(rune["id"])] = rune.get("name")
    except Exception as e:
        print(f"Error fetching runes: {e}")

    # 3. Obtener summoners
    try:
        url = f"https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/summoner.json"
        data = requests.get(url, timeout=5).json()
        for k, v in data.get("data", {}).items():
            summoner_map[int(v["key"])] = v.get("name")
    except Exception as e:
        print(f"Error fetching summoners: {e}")

    # Mappings heredados de ítems eliminados de versiones recientes de DDragon (ej. 3097 = Stormrazor)
    legacy_items = {
        3097: "Stormrazor"
    }
    for k, v in legacy_items.items():
        if k not in item_map:
            item_map[k] = v

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

    # Claves esenciales de detalles utilizadas por la interfaz web
    DETAIL_KEYS = {
        "deltaAgainstPhysicalDamage", "deltaAgainstMagicDamage", "deltaAgainstBalancedDamage",
        "deltaWhenHighRange", "deltaWhenLowRange", "deltaWhenBalancedRange",
        "deltaWhenTanky", "deltaWhenSquishy", "deltaWhenBalancedTankiness",
        "deltaWhenHighCC", "deltaWhenLowCC", "deltaWhenNormalCC",
        "deltaWhenGoldAhead", "deltaWhenGoldBehind", "deltaWhenGoldBalanced",
        "physicalDamageOccurrence", "magicDamageOccurrence", "balancedDamageOccurrence",
        "highRangeOccurrence", "lowRangeOccurrence", "balancedRangeOccurrence",
        "tankyOccurrence", "squishyOccurrence", "balancedTankinessOccurrence",
        "highCCOccurrence", "lowCCOccurrence", "normalCCOccurrence",
        "goldAheadOccurrence", "goldBehindOccurrence", "goldBalancedOccurrence"
    }

    records = []

    for patch, sections in raw_data.items():
        if not sections:
            continue
        item_details_map = sections.get("item_details", {})
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

                if cat_name == "All Items" and item_details_map:
                    item_id_str = str(parsed["id"])
                    if item_id_str in item_details_map:
                        raw_details = item_details_map[item_id_str].get("detailed")
                        if isinstance(raw_details, dict):
                            filtered_details = {
                                k: round(float(v), 4) if isinstance(v, float) else int(v) if isinstance(v, int) else v
                                for k, v in raw_details.items()
                                if k in DETAIL_KEYS and v is not None
                            }
                            if filtered_details:
                                parsed["details"] = filtered_details
                records.append(parsed)

    # Exportar registros individuales a JSON Granular compacto en docs/data/granular/
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
