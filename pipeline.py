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

def run_step(step_num, title, command, allow_interrupt=False, extra_args=None):
    print(f"\n{'='*60}")
    print(f"[{step_num}/3] {title}")
    print(f"{'='*60}\n")
    start = time.time()
    cmd = [sys.executable, command]
    if extra_args:
        cmd.extend(extra_args)
    try:
        res = subprocess.run(cmd)
    except KeyboardInterrupt:
        if allow_interrupt:
            print(f"\n[!] Paso '{title}' interrumpido por el usuario. Continuando con el procesamiento de datos recolectados...")
            return
        raise

    elapsed = round(time.time() - start, 2)
    if res.returncode != 0:
        if allow_interrupt and res.returncode in (130, -2, -9):
            print(f"\n[!] Paso '{title}' pausado por el usuario. Continuando con el procesamiento de datos recolectados...")
            return
        print(f"\n[ERROR] El paso '{title}' falló con código {res.returncode}.")
        sys.exit(res.returncode)
    print(f"\n[OK] Paso completado en {elapsed}s.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(
        description="Pipeline Maestro de Zinkoachless.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Modos de ejecución:
  python3 pipeline.py                       Descarga normal con actualización del último parche.
  python3 pipeline.py -e, --exclude-latest  Descarga hasta el penúltimo parche y omite campeones ya guardados en 0s.
  python3 pipeline.py -s, --skip-existing   Descarga todos los parches sin re-verificar campeones ya guardados.
        """
    )
    parser.add_argument("--exclude-latest", "-e", action="store_true",
                        help="Descarga solo hasta el penúltimo parche de config.json y omite campeones existentes (0s).")
    parser.add_argument("--skip-existing", "-s", "--no-update", action="store_true",
                        help="Omite la comprobación de actualizaciones si el campeón ya tiene datos locales.")
    args, unknown = parser.parse_known_args()

    forward_args = []
    if args.exclude_latest:
        forward_args.append("--exclude-latest")
    if args.skip_existing:
        forward_args.append("--skip-existing")

    print("\n⚡ INICIANDO PIPELINE COMPLETO DE ZINKOACHLESS ⚡\n")
    total_start = time.time()
    
    run_step(1, "Rastreando historial de cambios de balance (DDragon)", "patch_history.py")
    run_step(2, "Descargando estadísticas de campeones (Coachless)", "get-wpa.py", allow_interrupt=True, extra_args=forward_args)
    run_step(3, "Procesando métricas, WPA y exportando a docs/", "process_wpa.py")
    
    total_elapsed = round(time.time() - total_start, 2)
    print(f"\n{'='*60}")
    print(f"PIPELINE FINALIZADO CON ÉXITO EN {total_elapsed}s")
    print(f"{'='*60}\n")
