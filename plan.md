# Plan de Desarrollo: Pipeline de Agregación WPA Multiparche

## 1. Arquitectura del Pipeline

El sistema se divide en tres fases modulares:
1. **Extracción (`get_wp.py` / Módulo Fetcher):** Realiza las peticiones a la API oficial de Coachless iterando por parche y guardando los datos crudos en JSON.
2. **Transformación y Agregación (`process_wpa.py`):** Carga los datos crudos, normaliza las estructuras, calcula el WPA ponderado por objeto/runa y consolida el volumen total de partidas/compras.
3. **Exportación y Presentación:** Genera archivos limpios (`.json` para frontends web tipo React/Vue/Svelte y `.csv` para análisis tabular en Excel) listos para renderizarse en tablas o dashboards interactivos.

---

## 2. Requerimientos Matemáticos de Agregación

Para cada elemento único (objeto, runa, etc.) a lo largo de $K$ parches:

* **Muestra Total ($N_{\text{total}}$):**
  $$N_{\text{total}} = \sum_{i=1}^K N_i$$

* **WPA Ponderado Final ($\text{WPA}_{\text{weighted}}$):**
  $$\text{WPA}_{\text{weighted}} = \frac{\sum_{i=1}^K (N_i \times \text{WPA}_i)}{N_{\text{total}}}$$

* **Filtros de Confianza Estadística:**
  * Descartar o marcar como "Baja confianza" cualquier elemento cuyo $N_{\text{total}} < \text{Umbral Mínimo}$ (por ejemplo, $N_{\text{total}} < 300$).

---

## 3. Script de Procesamiento y Agregación (`process_wpa.py`)

Crea este script en el mismo directorio. Lee el archivo crudo generado por el scraper y genera los formatos finales (`clean_wpa.json` y `clean_wpa.csv`).

```python
import json
import csv
from collections import defaultdict

INPUT_FILE = "lucian_wpa_parches.json"
OUTPUT_JSON = "lucian_multipatch_clean.json"
OUTPUT_CSV = "lucian_multipatch_clean.csv"

# Umbral mínimo de compras agregadas para considerar la muestra confiable
MIN_BUYS_THRESHOLD = 100

def aggregate_wpa_data(raw_data):
    """
    Agrupa elementos por ID/nombre y calcula el promedio ponderado de WPA.
    Nota: Ajustar las claves 'itemId', 'wpa', 'buys' según la estructura 
    exacta que retorne el endpoint de Coachless.
    """
    aggregated = defaultdict(lambda: {"total_weighted_wpa": 0.0, "total_buys": 0, "name": ""})

    for patch_key, patch_content in raw_data.items():
        # Asumiendo que patch_content contiene una lista de registros o diccionarios
        # Si la API devuelve un dict anidado (ej. patch_content['data']), ajústalo aquí:
        items_list = patch_content if isinstance(patch_content, list) else patch_content.get("items", [])

        for entry in items_list:
            item_id = entry.get("itemId") or entry.get("id")
            item_name = entry.get("name", f"Item_{item_id}")
            wpa = float(entry.get("wpa", 0.0))
            buys = int(entry.get("buys", 0))

            if buys <= 0:
                continue

            aggregated[item_id]["name"] = item_name
            aggregated[item_id]["total_buys"] += buys
            aggregated[item_id]["total_weighted_wpa"] += (wpa * buys)

    # Cálculo final
    results = []
    for item_id, stats in aggregated.items():
        total_buys = stats["total_buys"]
        if total_buys == 0:
            continue
        
        final_wpa = stats["total_weighted_wpa"] / total_buys
        
        results.append({
            "item_id": item_id,
            "item_name": stats["name"],
            "total_buys": total_buys,
            "weighted_wpa": round(final_wpa, 2),
            "is_reliable": total_buys >= MIN_BUYS_THRESHOLD
        })

    # Ordenar de mayor a menor WPA
    results.sort(key=lambda x: x["weighted_wpa"], reverse=True)
    return results

def export_to_json(data, filename):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"-> JSON exportado con éxito: {filename}")

def export_to_csv(data, filename):
    if not data:
        return
    headers = ["item_id", "item_name", "total_buys", "weighted_wpa", "is_reliable"]
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(data)
    print(f"-> CSV exportado con éxito: {filename}")

def main():
    try:
        with open(INPUT_FILE, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {INPUT_FILE}. Ejecuta get_wp.py primero.")
        return

    processed_data = aggregate_wpa_data(raw_data)
    export_to_json(processed_data, OUTPUT_JSON)
    export_to_csv(processed_data, OUTPUT_CSV)
    print(f"Procesamiento finalizado. Total elementos analizados: {len(processed_data)}")

if __name__ == "__main__":
    main()

```

---

## 4. Estructura de Datos de Salida (Frontend-Ready)

### Salida JSON (`clean_wpa.json`):

```json
[
  {
    "item_id": 3031,
    "item_name": "Infinity Edge",
    "total_buys": 18450,
    "weighted_wpa": 1.42,
    "is_reliable": true
  },
  {
    "item_id": 6695,
    "item_name": "Serpent's Fang",
    "total_buys": 890,
    "weighted_wpa": 2.15,
    "is_reliable": true
  }
]

```