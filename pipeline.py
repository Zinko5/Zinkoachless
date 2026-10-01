#!/usr/bin/env python3
"""
Pipeline Maestro de Zinkoachless.
Ejecuta secuencialmente:
  1. patch_history.py  (Auditoría y diff de parches en DDragon)
  2. get-wpa.py        (Descarga y caché de estadísticas desde Coachless)
  3. process_wpa.py    (Ponderación exponencial, normalización y exportación para GitHub Pages)
"""

import subprocess
import sys
import time

def run_step(step_num, title, command):
    print(f"\n{'='*60}")
    print(f"[{step_num}/3] {title}")
    print(f"{'='*60}\n")
    start = time.time()
    res = subprocess.run([sys.executable, command])
    elapsed = round(time.time() - start, 2)
    if res.returncode != 0:
        print(f"\n[ERROR] El paso '{title}' falló con código {res.returncode}.")
        sys.exit(res.returncode)
    print(f"\n[OK] Paso completado en {elapsed}s.")

if __name__ == "__main__":
    print("\n⚡ INICIANDO PIPELINE COMPLETO DE ZINKOACHLESS ⚡\n")
    total_start = time.time()
    
    run_step(1, "Rastreando historial de cambios de balance (DDragon)", "patch_history.py")
    run_step(2, "Descargando estadísticas de campeones (Coachless)", "get-wpa.py")
    run_step(3, "Procesando métricas, WPA y exportando a docs/", "process_wpa.py")
    
    total_elapsed = round(time.time() - total_start, 2)
    print(f"\n{'='*60}")
    print(f"PIPELINE FINALIZADO CON ÉXITO EN {total_elapsed}s")
    print(f"{'='*60}\n")
