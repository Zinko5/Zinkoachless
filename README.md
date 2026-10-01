# Zinkoachless

> Motor analítico multiparche de **Win Probability Added (WPA)** y exportador de conjuntos de objetos para League of Legends.

[![Demo en Vivo](https://img.shields.io/badge/Demo%20en%20Vivo-GitHub%20Pages-3b82f6?style=flat-square&logo=github)](https://zinko5.github.io/Zinkoachless/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Riot Games](https://img.shields.io/badge/League%20of%20Legends-Season%2016-C89B3C?style=flat-square&logo=leagueoflegends&logoColor=white)](https://leagueoflegends.com/)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=flat-square)](LICENSE)

Zinkoachless es un dashboard interactivo y pipeline de datos diseñado para analistas, theorycrafters y jugadores competitivos. Permite evaluar el impacto estadístico real de objetos, runas y hechizos de invocador agregando el historial de múltiples parches consecutivos mediante modelos de decaimiento temporal y exportar configuraciones directamente al cliente de Riot Games.

**Sitio web desplegado:** [https://zinko5.github.io/Zinkoachless/](https://zinko5.github.io/Zinkoachless/)

---

## Tabla de Contenidos

- [Motivación](#motivación)
- [Funcionalidades Destacadas](#funcionalidades-destacadas)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Instalación y Requisitos](#instalación-y-requisitos)
- [Pipeline de Datos y Modos de Ejecución](#pipeline-de-datos-y-modos-de-ejecución)
- [Cómo Añadir Campeones o Parches](#cómo-añadir-campeones-o-parches)
- [Exportador de Conjuntos de Objetos](#exportador-de-conjuntos-de-objetos)
- [Metodología Matemática](#metodología-matemática)
- [Despliegue](#despliegue)

---

## Motivación

1. **Problema de la muestra en parches individuales:** En análisis de alto nivel, los objetos situacionales y las estrategias *off-meta* no acumulan suficientes partidas en una única versión de dos semanas ($N < \text{umbral}$), provocando que las páginas comerciales descarten estas opciones o las marquen como ruido.
2. **Muros de pago en analíticas históricas:** Las plataformas de estadísticas restringen la agregación y cruce de datos multiparche a suscripciones de pago.
3. **Solución:** Zinkoachless consolida peticiones estructuradas a la API de Coachless, almacena en caché local las estadísticas históricas y aplica una función de decaimiento exponencial para mantener vigentes las tendencias recientes sin descartar el volumen de muestra histórico.

---

## Funcionalidades Destacadas

* **Selector de Campeones con Filtro por Rol:** Diseñado para la fase de selección (*Champ Select*), permite filtrar instantáneamente la lista de campeones por posición (Top, Jungla, Mid, Bot/ADC o Soporte) para identificar opciones disponibles y picks *off-meta* en segundos.
* **Control Temporal de Parches:** Intervalo configurable en vivo (parches 16.1 a 16.19+) que recalcula al instante en el navegador el WPA ponderado y las cuotas de mercado.
* **Filtro Post-Ajuste (⚡):** Cruza el historial de cambios de balance de Riot Data Dragon para omitir versiones previas al último ajuste de cada ítem o runa, evaluando solo su estado actual.
* **Algoritmo Smart Rank:** Puntuación compuesta que pondera el WPA reciente contra la confianza estadística de la muestra acumulada:
  $$\text{SmartScore} = \text{WPA}_{\text{recency}} \times \left(1 + 0.15 \times \log_{10}(\text{Muestra})\right)$$
* **Insignias Contextuales de Meta:** Clasificación automatizada en `Meta`, `Situacional / Hidden OP`, `Emergente` (tendencia al alza) y `Ajustado`.
* **Exportador de Builds 1-Click:** Generación de archivos `.json` compatibles con el importador de conjuntos del cliente oficial de LoL, tanto a nivel individual como en exportación masiva multi-campeón.
* **Arquitectura 100% Estática (SPA):** Carga perezosa (*lazy loading*) de datos granulares compactos (<150 KB iniciales). Cero latencia de backend y sin costos de servidor.
* **Soporte Multilingüe Dinámico:** Interfaz y catálogo de objetos disponibles en Español Latinoamericano (`es_MX`) e Inglés (`en_US`).

---

## Arquitectura del Sistema

```
zinkoachless/
├── config.json                # Single Source of Truth: temporada, parches y lista de campeones/roles
├── pipeline.py                # Orquestador del pipeline completo con soporte de flags CLI
├── get-wpa.py                 # Extracción con rate limiting inteligente y caché local desde Coachless
├── patch_history.py           # Diff y auditoría de cambios de balance mediante Riot Data Dragon
├── process_wpa.py             # Agregación matemática, cálculo de WPA y exportación a docs/
├── data/
│   ├── raw/                   # Almacén de respuestas brutas en caché local
│   └── processed/             # Historial de cambios de ítems y balances
└── docs/                      # Aplicación Web (SPA para GitHub Pages)
    ├── index.html             # Estructura semántica
    ├── styles.css             # Sistema de diseño, Glassmorphism y modo oscuro
    ├── app.js                 # Lógica interactiva, filtros reactivos y exportador de sets
    └── data/
        ├── config.json        # Configuración sincronizada para el frontend
        └── granular/          # Archivos JSON compactos cargados bajo demanda por campeón
```

---

## Instalación y Requisitos

### Requisitos
* Python 3.10 o superior.
* Administrador de entornos (`uv` recomendado, o `venv`/`pip`).

### Configuración del Entorno

Con `uv`:
```bash
uv venv
source .venv/bin/activate
uv pip install requests pandas
```

Con `pip` estándar:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install requests pandas
```

---

## Pipeline de Datos y Modos de Ejecución

El script maestro [`pipeline.py`](file:///home/zinko/publico/zinkoachless/pipeline.py) automatiza la ejecución secuencial de `patch_history.py`, `get-wpa.py` y `process_wpa.py`. Soporta parámetros CLI para optimizar tiempos y cuidar las cuotas de red:

### 1. Modo Relleno Rápido (`-s` / `--skip-existing`)
```bash
source .venv/bin/activate
python3 pipeline.py -s
```
* **Uso recomendado:** Al agregar nuevos campeones al catálogo o al reanudar la extracción tras reconectar una VPN.
* **Comportamiento:** Comprueba el almacenamiento local y **salta en 0 segundos** cualquier campeón que ya tenga todos los parches descargados, sin realizar ninguna petición a la API. Reserva el 100% de la cuota para los campeones nuevos o que tengan parches pendientes.

### 2. Modo Parches Estables (`-e` / `--exclude-latest`)
```bash
source .venv/bin/activate
python3 pipeline.py -e
```
* **Uso:** Cuando el último parche configurado acaba de salir y está en curso (poca muestra o datos preliminares).
* **Comportamiento:** Excluye el último parche de la lista y procesa únicamente hasta el penúltimo parche consolidado, omitiendo también en 0 segundos los campeones existentes.

### 3. Modo Actualización Completa (Por defecto)
```bash
source .venv/bin/activate
python3 pipeline.py
```
* **Uso:** Al finalizar la semana o cuando Riot publica un nuevo parche y se desea refrescar la muestra del parche activo para todos los campeones.

---

## Cómo Añadir Campeones o Parches

Toda la plataforma se gestiona de forma centralizada en [`config.json`](file:///home/zinko/publico/zinkoachless/config.json):

1. **Añadir un Campeón:** Agrega un objeto a la lista `"champions"` indicando su ID oficial, nombre y roles:
   ```json
   {
     "name": "Ezreal",
     "id": 81,
     "roles": [3, 2]
   }
   ```
   *Roles: `0: Top`, `1: Jungla`, `2: Mid`, `3: Bot/ADC`, `4: Support`.*

2. **Añadir Parches:** Incorpora el número del parche a la lista `"patches"`:
   ```json
   "patches": [1, 2, 3, ..., 18, 19]
   ```

3. **Ejecutar el Pipeline:**
   ```bash
   python3 pipeline.py -s
   ```
   La aplicación web, el selector de campeones, los selectores de línea y los archivos granulares se actualizarán automáticamente sin requerir cambios en el código HTML o JavaScript.

---

## Exportador de Conjuntos de Objetos

Los conjuntos generados son 100% compatibles con el cliente de League of Legends:

### Pasos para Importar en el Cliente de Riot Games
1. En Zinkoachless, haz clic en **Exportar Set** (para el campeón y rol actual) o abre el menú desplegable para usar el **Modal de Selección Múltiple**.
2. Copia los datos al portapapeles o descarga el archivo `.json`.
3. Abre el cliente de League of Legends y ve a **Colección** > **Objetos**.
4. Haz clic en **Importar conjuntos de objetos** y selecciona **Pegar conjunto copiado** o importa el archivo `.json` descargado.
5. El cliente reconocerá automáticamente el campeón y la posición durante la partida.

---

## Metodología Matemática

Para balancear la validez muestral de parches antiguos con la relevancia de los ajustes recientes, se implementa una media ponderada con decaimiento exponencial:

$$\text{WPA}_{\text{recency}} = \frac{\sum_{i=1}^N \text{WPA}(P_i) \times \text{Muestra}(P_i) \times \lambda^{(N - i)}}{\sum_{i=1}^N \text{Muestra}(P_i) \times \lambda^{(N - i)}}$$

*Donde:*
* $N$ es el índice del parche más reciente analizado.
* $i$ es el índice del parche correspondiente ($i \le N$).
* $\lambda = 0.75$ representa el factor de retención temporal (vida media de $\approx 2.4$ parches).

---

## Despliegue

La carpeta `docs/` contiene la aplicación web cliente estática y autosuficiente:
* **GitHub Pages:** En la configuración del repositorio, selecciona la rama `main` y la carpeta `/docs` como origen de publicación.
* **Servidor Local:** Para previsualizar los cambios localmente:
  ```bash
  python3 -m http.server 8000 --directory docs
  ```
  Accede a `http://localhost:8000` en tu navegador.
