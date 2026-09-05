# Zinkoachless

**Zinkoachless** es un agregador dinámico y visualizador de estadísticas multiparche de **Win Probability Added (WPA)** para League of Legends, diseñado para analizar el impacto real de objetos, runas y hechizos de invocador a lo largo del tiempo.

El nombre del proyecto rinde homenaje a la API de origen de las estadísticas (*Coachless*) combinada con el motor de procesamiento personalizado de Zinko.

---

## Resumen del Proyecto

### Objetivo
Construir una base de datos local y un dashboard analítico con estadísticas de rendimiento (**WPA**) consolidadas a lo largo de múltiples parches (versiones 16.1 a 16.17+) para descubrir *builds off-meta*, optimizar elecciones de objetos y encontrar estrategias competitivas ocultas.

### El Problema
* **Muestra insuficiente en parches individuales:** Los objetos y runas poco convencionales o de nicho se juegan con menor frecuencia en un solo parche. Su WPA no es estadísticamente fiable y las plataformas habituales los descartan como ruido o los muestran en gris.
* **Muros de pago:** El filtrado y la agregación multiparche (*Multi-Patch Analytics*) suelen ser funciones exclusivas de suscripciones de pago.

### Solución Implementada
1. **Extracción directa de la API de Coachless:** Automatización de descargas parche a parche mediante peticiones `POST` parametrizadas a los endpoints globales (`GetGlobalItemStatistics`, `GetKeystoneData`, `GetGlobalSummonerSpellStatistics`).
2. **Ponderación Exponencial por Reciente ($\lambda = 0.75$):** Se aplica un modelo de decaimiento temporal con una vida media aproximada de 2.4 parches, garantizando que el rendimiento de las versiones más recientes tenga mayor peso sin perder la solidez de la muestra acumulada.
   $$\text{WPA}_{\text{recency}} = \frac{\sum_{i=1}^N \text{WPA}(P_i) \times \text{Muestra}(P_i) \times 0.75^{(N - i)}}{\sum_{i=1}^N \text{Muestra}(P_i) \times 0.75^{(N - i)}}$$
3. **Seguimiento Histórico de Ajustes por Parche:** Rastreo automático de cambios de coste, estadísticas y descripciones mediante la API Data Dragon de Riot Games para identificar la versión exacta del último ajuste (`last_changed_patch`).
4. **Mapeo de Metadatos y Despliegue Offline:** Cruce dinámico con CDN oficial (DDragon) para asociar IDs con nombres en inglés e iconos oficiales, generando un bundle de datos local (`docs/data.js`) para funcionamiento 100% autónomo.

---

## Características Clave

* **Soporte Multicampeón Extensible:** Selector interactivo y buscador en tiempo real con más de 30 campeones soportados y filtrado por línea (Top, Jungla, Mid, Bot, Soporte).
* **Descargador Inteligente con Caché (`get-wpa.py`):**
  * Almacena datos crudos en `data/raw/` para evitar peticiones duplicadas a parches pasados.
  * Actualiza dinámicamente el parche en curso o los nuevos parches configurados.
  * Manejo robusto de red con reintentos exponenciales.
* **Rastreador de Cambios en Parches (`patch_history.py`):**
  * Descarga y compara la base de datos de objetos, runas clave y hechizos entre versiones consecutivas.
  * Determina qué elementos recibieron ajustes recientes para aplicar filtros precisos en la interfaz.
* **Procesador y Agregador Multidimensional (`process_wpa.py`):**
  * Normaliza y categoriza los datos en 8 secciones (Keystones, Invocador, Iniciales, Botas, 1º, 2º, 3º y 4º+ Objeto).
  * Exporta resúmenes en CSV (`data/processed/`) y el bundle integrado `docs/data.js`.
* **Filtros en Tiempo Real en la Web:**
  * **Rango de Parches:** Permite delimitar dinámicamente el periodo de análisis.
  * **Filtrar Post-Ajuste:** Excluye parches previos al último cambio de un objeto/runa para evaluar estrictamente su rendimiento tras el ajuste.
  * **Filtro de Cuota de Mercado:** Alterna entre `Populares & Solidez` (mínimo 0.5% del volumen de compras de la categoría) y `Catálogo Completo` (100% de la muestra registrada).
* **Algoritmo Smart Rank e Insignias Estadísticas:**
  * Ranking combinado de WPA ponderado y confianza de muestra logarítmica.
  * Etiquetas visuales: `Meta` (alto volumen y WPA positivo), `Situacional / Hidden OP` (alta eficiencia en nicho), `Emergente` (tendencia al alza) y `Ajustado` (cambio en el último parche).
* **Exportador de Conjuntos de Objetos para LoL:**
  * Copia al portapapeles en un clic el JSON estructurado para importar directamente en el cliente de League of Legends.
  * Incluye bloque personalizado *"Todos por WPA"* con opciones de valor positivo.

---

## Estructura del Proyecto

```
zinkoachless/
├── get-wpa.py                 # Extracción y almacenamiento en caché de estadísticas desde Coachless
├── process_wpa.py             # Agregación, mapeo con DDragon y generación de docs/data.js
├── patch_history.py           # Rastreador de cambios e historial de parches (objetos, runas, hechizos)
├── README.md                  # Documentación principal del proyecto
├── data/                      # Base de datos local organizada
│   ├── raw/                   # JSONs brutos en caché por parche y campeón
│   ├── processed/             # CSVs procesados e historial de ajustes (item_patch_history.json)
│   ├── consolidated/          # JSONs agregados globales anuales
│   └── granular/              # JSONs de desglose por parche para el cliente web
└── docs/                      # Aplicación Web Monopágina (SPA) y despliegue en GitHub Pages
    ├── index.html             # Marcado semántico y panel de control de filtros
    ├── styles.css             # Estilos de diseño, Badging y modo oscuro
    ├── app.js                 # Lógica del cliente, filtrado ponderado y exportador de conjuntos
    └── data.js                # Bundle de datos estáticos para ejecución offline
```

---

## Requisitos e Instalación

### Requisitos Previos
* **Python 3.10+**
* Entorno gestionado con **`uv`**

### Configuración del Entorno Virtual

Para activar el entorno virtual ya creado:
```bash
source .venv/bin/activate
```

En caso de requerir la creación de un nuevo entorno desde cero:
```bash
uv venv
source .venv/bin/activate
uv pip install requests pandas
```

---

## Flujo de Ejecución del Pipeline

Para actualizar las estadísticas e integrar nuevos parches o campeones:

1. **Activar el entorno virtual:**
   ```bash
   source .venv/bin/activate
   ```
2. **Ejecutar el rastreador de parches DDragon:**
   ```bash
   python3 patch_history.py
   ```
3. **Descargar / actualizar datos de la API:**
   ```bash
   python3 get-wpa.py
   ```
4. **Procesar y generar el bundle web:**
   ```bash
   python3 process_wpa.py
   ```

---

## ¿Cómo añadir un nuevo campeón?

Para incorporar un nuevo campeón (por ejemplo, **Ezreal** con ID `81` en la línea Bot/Carril Central):

1. **En [`get-wpa.py`](get-wpa.py):** Agrega la tupla de ID y rol a la lista `CHAMPIONS`:
   ```python
   # Formato: (champion_id, role_id)
   # Roles: 0: Top, 1: Jungle, 2: Mid, 3: Bot, 4: Support
   CHAMPIONS.append((81, 3))
   ```
2. **En [`docs/app.js`](docs/app.js):** Registra el nombre y los roles soportados en los diccionarios de mapeo:
   ```javascript
   championNames[81] = "Ezreal";
   championRolesMap[81] = [3, 2]; // Bot y Mid
   ```
3. **En [`docs/index.html`](docs/index.html):** Agrega la opción al menú desplegable `#champion-select`:
   ```html
   <option value="81" data-roles="3,2">Ezreal</option>
   ```
4. **Re-ejecutar el pipeline:**
   ```bash
   source .venv/bin/activate
   python3 patch_history.py && python3 get-wpa.py && python3 process_wpa.py
   ```

---

## Notas de Control de Versiones (Git)

Si deseas subir o registrar cambios en el repositorio Git, ejecuta los siguientes comandos en tu terminal local:

```bash
git add README.md
git commit -m "docs: mejorar y actualizar README con arquitectura multiparche y guías de uso"
git push origin main
```
