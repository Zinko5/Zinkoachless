# Plan de Adaptación: `process_wpa.py` (V2)

Este documento detalla las modificaciones necesarias para adaptar el procesador de datos a la nueva estructura JSON multi-endpoint generada por `get-wpa.py`.

---

## 1. Contexto del Cambio

El modelo de datos previo asumía una lista plana de objetos por parche. La interfaz real de Coachless desglosa las estadísticas en **8 secciones independientes**:

* **Runas y Hechizos:** `Keystone`, `Spell`
* **Objetos Tempranos:** `Starter`, `Boots`
* **Secuencia de Objetos (Core):** `1st Item`, `2nd Item`, `3rd Item`
* **Objetos Tardíos:** `4th+ Item`

---

## 2. Nueva Estructura del Archivo JSON de Entrada

El archivo generado por `get-wpa.py` almacena los datos jerárquicamente por parche y categoría:

```json
{
  "16.1": {
    "keystones": { ... },
    "summoner_spells": { ... },
    "boots_or_starters": { ... },
    "item_slot_1": { ... },
    "item_slot_2": { ... },
    "item_slot_3": { ... },
    "late_game_items": { ... }
  },
  "16.2": { ... }
}

```

---

## 3. Modificaciones Requeridas en `process_wpa.py`

### A. Extracción por Categoría / Slot

En lugar de iterar un único array de datos, el parser debe recorrer cada clave de categoría mapeando su origen a una etiqueta descriptiva:

| Clave en JSON | Categoría UI | Métrica de Volumen |
| --- | --- | --- |
| `keystones` | `Keystone` | Picks |
| `summoner_spells` | `Spell` | Picks |
| `boots_or_starters` | `Starter` / `Boots` | Buys |
| `item_slot_1` | `1st Item` | Buys |
| `item_slot_2` | `2nd Item` | Buys |
| `item_slot_3` | `3rd Item` | Buys |
| `late_game_items` | `4th+ Item` | Buys |

### B. Normalización y Aplanado (Flattening)

Cada registro extraído debe incluir metadatos unificados para facilitar el filtrado y la exportación a CSV/DataFrames:

* `patch`: Parche evaluado (ej. `"16.1"`).
* `category`: Categoría visual (`"1st Item"`, `"Keystone"`, etc.).
* `name_or_id`: ID o nombre del elemento.
* `wpa`: Valor numérico de Win Probability Added (ej. `+0.13`, `-1.66`).
* `sample_size`: Número de compras (`buys`) o selecciones (`picks`).

---

## 4. Implementación del Nuevo `process_wpa.py`

Reemplazar el archivo `process_wpa.py` con el siguiente código:

```python
import json
import pandas as pd

def parse_wpa_entry(item_data, category_label, patch_version):
    """Normaliza un registro individual de la API."""
    # Ajustar según los nombres exactos de clave en el payload de respuesta
    item_id = item_data.get("id") or item_data.get("itemId") or item_data.get("runeId") or item_data.get("spellId")
    name = item_data.get("name", f"ID_{item_id}")
    wpa = item_data.get("winProbabilityAdded", item_data.get("wpa", 0.0))
    sample = item_data.get("pickCount", item_data.get("buyCount", item_data.get("sampleSize", 0)))

    return {
        "patch": patch_version,
        "category": category_label,
        "id": item_id,
        "name": name,
        "wpa": round(float(wpa), 4) if wpa is not None else 0.0,
        "sample_size": sample
    }

def process_coachless_json(input_file, output_csv="coachless_processed_wpa.csv"):
    with open(input_file, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    category_mapping = {
        "keystones": "Keystone",
        "summoner_spells": "Spell",
        "boots_or_starters": "Boots / Starter",
        "item_slot_1": "1st Item",
        "item_slot_2": "2nd Item",
        "item_slot_3": "3rd Item",
        "late_game_items": "4th+ Item"
    }

    records = []

    for patch, sections in raw_data.items():
        for section_key, cat_name in category_mapping.items():
            section_content = sections.get(section_key)
            if not section_content:
                continue

            # Si la respuesta contiene una lista directa o un objeto con lista interna
            items_list = section_content if isinstance(section_content, list) else section_content.get("statistics", section_content.get("items", []))

            for entry in items_list:
                records.append(parse_wpa_entry(entry, cat_name, patch))

    df = pd.DataFrame(records)
    df.to_csv(output_csv, index=False, encoding="utf-8-sig")
    print(f"Procesamiento completado: {len(df)} registros exportados a '{output_csv}'.")
    return df

if __name__ == "__main__":
    # Ajustar la ruta al JSON generado por get-wpa.py
    INPUT_FILE = "coachless_champ_236_full_stats.json"
    df = process_coachless_json.py(INPUT_FILE)
    print(df.head(10))

```

---

## 5. Salida Esperada

El DataFrame / CSV resultante contendrá la estructura tabular lista para comparativas de parches:

| patch | category | id | name | wpa | sample_size |
| --- | --- | --- | --- | --- | --- |
| `16.1` | `Keystone` | 8005 | Press the Attack | `0.18` | 358800 |
| `16.1` | `1st Item` | 3508 | Essence Reaver | `0.13` | 344100 |
| `16.1` | `2nd Item` | 3156 | Maw of Malmortius | `5.42` | 102 |
| `16.1` | `Boots / Starter` | 3047 | Plated Steelcaps | `1.66` | 65200 |