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

def process_coachless_json(input_file, output_csv, output_json, output_granular_json):
    try:
        with open(input_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {input_file} no encontrado.")
        return

    print("Obteniendo última versión de DDragon...")
    latest_version = get_latest_version()
    print(f"Versión seleccionada: {latest_version}")
    
    print("Descargando traducciones de objetos, runas y hechizos...")
    item_map, rune_map, summoner_map = fetch_names_mapping(latest_version)

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
        item_details_map = sections.get("item_details", {})
        for section_key, cat_name in category_mapping.items():
            section_content = sections.get(section_key)
            if not section_content:
                continue

            # Si es una lista o dict
            items_list = section_content if isinstance(section_content, list) else section_content.get("statistics", section_content.get("items", []))

            for entry in items_list:
                parsed = parse_wpa_entry(entry, cat_name, patch, item_map, rune_map, summoner_map)
                if cat_name == "All Items" and item_details_map:
                    item_id_str = str(parsed["id"])
                    if item_id_str in item_details_map:
                        parsed["details"] = item_details_map[item_id_str].get("detailed")
                records.append(parsed)

    # 1. Exportar registros individuales a CSV
    headers = ["patch", "category", "id", "name", "wpa", "sample_size"]
    with open(output_csv, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(records)
    print(f"CSV exportado: {len(records)} registros guardados en '{output_csv}'.")

    # 2. Exportar registros individuales a JSON Granular
    with open(output_granular_json, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f"JSON granular exportado con éxito a '{output_granular_json}'.")

    # 3. Consolidar agregación de múltiples parches para la interfaz UI
    aggregated = defaultdict(lambda: {"weighted_wpa_sum": 0.0, "total_sample": 0, "name": ""})
    for r in records:
        key = (r["category"], r["id"])
        aggregated[key]["name"] = r["name"]
        aggregated[key]["total_sample"] += r["sample_size"]
        aggregated[key]["weighted_wpa_sum"] += r["wpa"] * r["sample_size"]

    consolidated = []
    for (category, item_id), stats in aggregated.items():
        total = stats["total_sample"]
        if total == 0:
            continue
        avg_wpa = stats["weighted_wpa_sum"] / total
        consolidated.append({
            "category": category,
            "id": item_id,
            "name": stats["name"],
            "wpa": round(avg_wpa, 4),
            "sample_size": total
        })

    # Guardar JSON consolidado
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(consolidated, f, ensure_ascii=False, indent=2)
    print(f"JSON consolidado exportado con éxito a '{output_json}'.")

if __name__ == "__main__":
    import glob
    import re
    import os
    
    # Crear estructura de carpetas
    os.makedirs(os.path.join("data", "processed"), exist_ok=True)
    os.makedirs(os.path.join("data", "consolidated"), exist_ok=True)
    os.makedirs(os.path.join("data", "granular"), exist_ok=True)
    
    # Escanear archivos de estadísticas de campeones en data/raw/
    processed_ids = []
    for filepath in glob.glob(os.path.join("data", "raw", "coachless_champ_*_full_stats.json")):
        match = re.search(r"coachless_champ_(\d+)_full_stats.json", filepath)
        if match:
            champ_id = match.group(1)
            output_csv = os.path.join("data", "processed", f"coachless_processed_wpa_{champ_id}.csv")
            output_json = os.path.join("data", "consolidated", f"coachless_consolidated_wpa_{champ_id}.json")
            output_granular_json = os.path.join("data", "granular", f"coachless_granular_wpa_{champ_id}.json")
            
            print(f"\n---> Procesando estadísticas del Campeón ID: {champ_id}")
            process_coachless_json(filepath, output_csv, output_json, output_granular_json)
            processed_ids.append(champ_id)
            
    # Generar/actualizar automáticamente docs/data.js para compatibilidad sin conexión (offline)
    data_js_path = os.path.join("docs", "data.js")
    try:
        js_content = ""
        for champ_id in sorted(processed_ids, key=int):
            g_file = os.path.join("data", "granular", f"coachless_granular_wpa_{champ_id}.json")
            if os.path.exists(g_file):
                with open(g_file, "r", encoding="utf-8") as f:
                    g_data = json.load(f)
                js_content += f"const fallbackGranularData{champ_id} = {json.dumps(g_data, ensure_ascii=False, indent=2)};\n\n"
        
        if js_content:
            os.makedirs("docs", exist_ok=True)
            with open(data_js_path, "w", encoding="utf-8") as f:
                f.write(js_content.strip() + "\n")
            print(f"\n---> 'docs/data.js' actualizado dinámicamente con los fallbacks offline de los campeones: {', '.join(processed_ids)}.")
    except Exception as e:
        print(f"Error al generar 'page/data.js': {e}")
