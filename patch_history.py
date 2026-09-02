import json
import os
import requests

DATA_RAW_DIR = os.path.join("data", "raw")
OUTPUT_FILE = os.path.join("data", "processed", "item_patch_history.json")

MAJOR = 16
PATCHES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

def fetch_ddragon_items(major, patch):
    os.makedirs(DATA_RAW_DIR, exist_ok=True)
    cache_path = os.path.join(DATA_RAW_DIR, f"ddragon_items_{major}_{patch}.json")
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
            
    version_str = f"{major}.{patch}.1"
    url = f"https://ddragon.leagueoflegends.com/cdn/{version_str}/data/en_US/item.json"
    try:
        res = requests.get(url, timeout=10)
        if res.status_code == 200:
            data = res.json().get("data", {})
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return data
    except Exception as e:
        print(f"Error descargando DDragon items {version_str}: {e}")
    return {}

def fetch_ddragon_runes(major, patch):
    os.makedirs(DATA_RAW_DIR, exist_ok=True)
    cache_path = os.path.join(DATA_RAW_DIR, f"ddragon_runes_{major}_{patch}.json")
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass

    version_str = f"{major}.{patch}.1"
    url = f"https://ddragon.leagueoflegends.com/cdn/{version_str}/data/en_US/runesReforged.json"
    try:
        res = requests.get(url, timeout=10)
        if res.status_code == 200:
            raw_paths = res.json()
            runes_dict = {}
            for path in raw_paths:
                for slot in path.get("slots", []):
                    for rune in slot.get("runes", []):
                        runes_dict[str(rune["id"])] = {
                            "name": rune.get("name"),
                            "shortDesc": rune.get("shortDesc"),
                            "longDesc": rune.get("longDesc")
                        }
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(runes_dict, f, ensure_ascii=False, indent=2)
            return runes_dict
    except Exception as e:
        print(f"Error descargando DDragon runes {version_str}: {e}")
    return {}

def fetch_ddragon_summoners(major, patch):
    os.makedirs(DATA_RAW_DIR, exist_ok=True)
    cache_path = os.path.join(DATA_RAW_DIR, f"ddragon_summoners_{major}_{patch}.json")
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass

    version_str = f"{major}.{patch}.1"
    url = f"https://ddragon.leagueoflegends.com/cdn/{version_str}/data/en_US/summoner.json"
    try:
        res = requests.get(url, timeout=10)
        if res.status_code == 200:
            raw_data = res.json().get("data", {})
            spells_dict = {}
            for k, v in raw_data.items():
                spells_dict[str(v.get("key"))] = {
                    "name": v.get("name"),
                    "description": v.get("description"),
                    "cooldownBurn": v.get("cooldownBurn")
                }
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(spells_dict, f, ensure_ascii=False, indent=2)
            return spells_dict
    except Exception as e:
        print(f"Error descargando DDragon summoners {version_str}: {e}")
    return {}

def analyze_patch_history():
    print("=== Iniciando Rastreo Completo de Cambios en DDragon (Objetos, Runas, Hechizos) ===")
    
    sorted_patches = [f"{MAJOR}.{p}" for p in PATCHES]
    entity_history = {} # entity_id (str) -> {"last_changed_patch": str, "history": list}

    # Tracking de Objetos
    items_by_patch = {}
    for p in PATCHES:
        items_by_patch[f"{MAJOR}.{p}"] = fetch_ddragon_items(MAJOR, p)

    # Tracking de Runas
    runes_by_patch = {}
    for p in PATCHES:
        runes_by_patch[f"{MAJOR}.{p}"] = fetch_ddragon_runes(MAJOR, p)

    # Tracking de Hechizos de Invocador
    summoners_by_patch = {}
    for p in PATCHES:
        summoners_by_patch[f"{MAJOR}.{p}"] = fetch_ddragon_summoners(MAJOR, p)

    # 1. Procesar Objetos
    for idx, patch_key in enumerate(sorted_patches):
        current_data = items_by_patch.get(patch_key, {})
        if idx == 0:
            for item_id_str in current_data.keys():
                entity_history[item_id_str] = {"last_changed_patch": patch_key, "type": "item"}
            continue

        prev_patch_key = sorted_patches[idx - 1]
        prev_data = items_by_patch.get(prev_patch_key, {})

        for item_id_str, item_info in current_data.items():
            if item_id_str not in entity_history:
                entity_history[item_id_str] = {"last_changed_patch": patch_key, "type": "item"}
                continue

            prev_info = prev_data.get(item_id_str)
            if not prev_info:
                entity_history[item_id_str]["last_changed_patch"] = patch_key
                continue

            gold_changed = item_info.get("gold", {}).get("total") != prev_info.get("gold", {}).get("total")
            stats_changed = item_info.get("stats") != prev_info.get("stats")
            desc_changed = item_info.get("description") != prev_info.get("description")

            if gold_changed or stats_changed or desc_changed:
                entity_history[item_id_str]["last_changed_patch"] = patch_key

    # 2. Procesar Runas (Hail of Blades, PTA, Conqueror, etc.)
    for idx, patch_key in enumerate(sorted_patches):
        current_data = runes_by_patch.get(patch_key, {})
        if idx == 0:
            for rune_id_str in current_data.keys():
                if rune_id_str not in entity_history:
                    entity_history[rune_id_str] = {"last_changed_patch": patch_key, "type": "rune"}
            continue

        prev_patch_key = sorted_patches[idx - 1]
        prev_data = runes_by_patch.get(prev_patch_key, {})

        for rune_id_str, rune_info in current_data.items():
            if rune_id_str not in entity_history:
                entity_history[rune_id_str] = {"last_changed_patch": patch_key, "type": "rune"}
                continue

            prev_info = prev_data.get(rune_id_str)
            if not prev_info:
                entity_history[rune_id_str]["last_changed_patch"] = patch_key
                continue

            short_changed = rune_info.get("shortDesc") != prev_info.get("shortDesc")
            long_changed = rune_info.get("longDesc") != prev_info.get("longDesc")

            if short_changed or long_changed:
                entity_history[rune_id_str]["last_changed_patch"] = patch_key

    # 3. Procesar Hechizos de Invocador
    for idx, patch_key in enumerate(sorted_patches):
        current_data = summoners_by_patch.get(patch_key, {})
        if idx == 0:
            for spell_id_str in current_data.keys():
                if spell_id_str not in entity_history:
                    entity_history[spell_id_str] = {"last_changed_patch": patch_key, "type": "summoner"}
            continue

        prev_patch_key = sorted_patches[idx - 1]
        prev_data = summoners_by_patch.get(prev_patch_key, {})

        for spell_id_str, spell_info in current_data.items():
            if spell_id_str not in entity_history:
                entity_history[spell_id_str] = {"last_changed_patch": patch_key, "type": "summoner"}
                continue

            prev_info = prev_data.get(spell_id_str)
            if not prev_info:
                entity_history[spell_id_str]["last_changed_patch"] = patch_key
                continue

            desc_changed = spell_info.get("description") != prev_info.get("description")
            cd_changed = spell_info.get("cooldownBurn") != prev_info.get("cooldownBurn")

            if desc_changed or cd_changed:
                entity_history[spell_id_str]["last_changed_patch"] = patch_key

    # Exportar resultado final
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(entity_history, f, ensure_ascii=False, indent=2)

    print(f"\n[✓] Rastreo completo finalizado. Entidades analizadas: {len(entity_history)}. Guardado en '{OUTPUT_FILE}'.")
    return entity_history

if __name__ == "__main__":
    analyze_patch_history()
