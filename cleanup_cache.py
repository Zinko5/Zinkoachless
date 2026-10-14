import os
import re
import glob
import json

def clean_stale_cache(config_path="config.json", verbose=True):
    """
    Elimina definitivamente los archivos de cache, datos procesados y exportaciones
    granulares de campeones o roles que hayan sido eliminados de config.json.
    Retorna una lista con las rutas de los archivos eliminados.
    """
    if not os.path.exists(config_path):
        if verbose:
            print(f"[Limpieza] Archivo de configuracion no encontrado: {config_path}")
        return []

    try:
        with open(config_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)
    except Exception as e:
        if verbose:
            print(f"[Limpieza] Error al leer {config_path}: {e}")
        return []

    # Construir conjuntos de perfiles validos (id, rol) e IDs de campeones validos
    valid_profiles = set()
    valid_champ_ids = set()

    for c in cfg.get("champions", []):
        try:
            cid = int(c["id"])
            valid_champ_ids.add(cid)
            for r in c.get("roles", []):
                valid_profiles.add((cid, int(r)))
        except (ValueError, KeyError, TypeError):
            continue

    deleted_files = []

    # 1. Limpiar data/raw/
    raw_dir = os.path.join("data", "raw")
    if os.path.isdir(raw_dir):
        for fname in os.listdir(raw_dir):
            filepath = os.path.join(raw_dir, fname)
            if not os.path.isfile(filepath):
                continue

            m_role = re.match(r"^coachless_champ_(\d+)_role_(\d+)_full_stats\.json$", fname)
            m_base = re.match(r"^coachless_champ_(\d+)_full_stats\.json$", fname)

            if m_role:
                cid, role = int(m_role.group(1)), int(m_role.group(2))
                if (cid, role) not in valid_profiles:
                    try:
                        os.remove(filepath)
                        deleted_files.append(filepath)
                        if verbose:
                            print(f"[Limpieza] Eliminado cache raw (rol no configurado): {filepath}")
                    except OSError as e:
                        if verbose:
                            print(f"[Limpieza] Error al eliminar {filepath}: {e}")
            elif m_base:
                cid = int(m_base.group(1))
                if cid not in valid_champ_ids:
                    try:
                        os.remove(filepath)
                        deleted_files.append(filepath)
                        if verbose:
                            print(f"[Limpieza] Eliminado cache raw (campeon no configurado): {filepath}")
                    except OSError as e:
                        if verbose:
                            print(f"[Limpieza] Error al eliminar {filepath}: {e}")

    # 2. Limpiar docs/data/granular/
    granular_dir = os.path.join("docs", "data", "granular")
    if os.path.isdir(granular_dir):
        for fname in os.listdir(granular_dir):
            filepath = os.path.join(granular_dir, fname)
            if not os.path.isfile(filepath):
                continue

            m_role = re.match(r"^coachless_granular_wpa_(\d+)_role_(\d+)\.json$", fname)
            m_base = re.match(r"^coachless_granular_wpa_(\d+)\.json$", fname)

            if m_role:
                cid, role = int(m_role.group(1)), int(m_role.group(2))
                if (cid, role) not in valid_profiles:
                    try:
                        os.remove(filepath)
                        deleted_files.append(filepath)
                        if verbose:
                            print(f"[Limpieza] Eliminado granular exportado (rol no configurado): {filepath}")
                    except OSError as e:
                        if verbose:
                            print(f"[Limpieza] Error al eliminar {filepath}: {e}")
            elif m_base:
                cid = int(m_base.group(1))
                if cid not in valid_champ_ids:
                    try:
                        os.remove(filepath)
                        deleted_files.append(filepath)
                        if verbose:
                            print(f"[Limpieza] Eliminado granular exportado (campeon no configurado): {filepath}")
                    except OSError as e:
                        if verbose:
                            print(f"[Limpieza] Error al eliminar {filepath}: {e}")

    # 3. Limpiar data/processed/ (CSVs de campeones si existen)
    processed_dir = os.path.join("data", "processed")
    if os.path.isdir(processed_dir):
        for fname in os.listdir(processed_dir):
            filepath = os.path.join(processed_dir, fname)
            if not os.path.isfile(filepath):
                continue

            m_role = re.match(r"^coachless_processed_wpa_(\d+)_role_(\d+)\.csv$", fname)
            m_base = re.match(r"^coachless_processed_wpa_(\d+)\.csv$", fname)

            if m_role:
                cid, role = int(m_role.group(1)), int(m_role.group(2))
                if (cid, role) not in valid_profiles:
                    try:
                        os.remove(filepath)
                        deleted_files.append(filepath)
                        if verbose:
                            print(f"[Limpieza] Eliminado procesado CSV (rol no configurado): {filepath}")
                    except OSError as e:
                        if verbose:
                            print(f"[Limpieza] Error al eliminar {filepath}: {e}")
            elif m_base:
                cid = int(m_base.group(1))
                if cid not in valid_champ_ids:
                    try:
                        os.remove(filepath)
                        deleted_files.append(filepath)
                        if verbose:
                            print(f"[Limpieza] Eliminado procesado CSV (campeon no configurado): {filepath}")
                    except OSError as e:
                        if verbose:
                            print(f"[Limpieza] Error al eliminar {filepath}: {e}")

    if verbose and deleted_files:
        print(f"[Limpieza] Total de archivos eliminados: {len(deleted_files)}")
    elif verbose:
        print("[Limpieza] No se detectaron archivos huerfanos. Cache alineada con config.json.")

    return deleted_files

if __name__ == "__main__":
    clean_stale_cache()
