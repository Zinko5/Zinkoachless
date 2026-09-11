# Zinkoachless

Dashboard analítico y motor de agregación multiparche de **Win Probability Added (WPA)** para League of Legends. Diseñado para theorycrafters, analistas y jugadores competitivos que buscan identificar el rendimiento estadístico real de objetos, runas y hechizos de invocador a lo largo de múltiples parches consecutivos.

El proyecto combina la extracción directa de datos de la API de *Coachless* con modelos matemáticos de decaimiento temporal y un exportador masivo de conjuntos de objetos directamente compatibles con el cliente de Riot Games.

---

## Tabla de Contenidos

- [Resumen del Proyecto](#resumen-del-proyecto)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Exportador de Conjuntos para League of Legends](#exportador-de-conjuntos-para-league-of-legends)
- [Metodología Matemática](#metodología-matemática)
- [Estructura del Repositorio](#estructura-del-repositorio)
- [Instalación y Configuración](#instalación-y-configuración)
- [Pipeline de Actualización de Datos](#pipeline-de-actualización-de-datos)
- [Cómo Añadir un Nuevo Campeón](#cómo-añadir-un-nuevo-campeón)
- [Despliegue](#despliegue)

---

## Resumen del Proyecto

### El Problema
- **Muestra insuficiente en parches individuales:** En análisis competitivos, los objetos o elecciones de nicho no alcanzan volumen estadístico suficiente en una sola versión ($N < \text{umbral}$), por lo que las plataformas habituales suelen descartarlos o mostrarlos en gris como ruido.
- **Muros de pago:** Las plataformas comerciales restringen la agregación multiparche (*Multi-Patch Analytics*) a planes de suscripción de pago.

### La Solución
1. **Extracción y Caché Local:** Descarga estructurada de datos parche a parche desde los endpoints de Coachless sin peticiones redundantes.
2. **Ponderación Temporal Reciente:** Aplicación de un factor de decaimiento exponencial ($\lambda = 0.75$) para priorizar los parches recientes sin sacrificar la muestra acumulada.
3. **Filtro Post-Ajuste:** Rastreo de cambios de balance mediante la API de Riot Data Dragon para excluir parches anteriores a la última modificación de cada elemento.
4. **Arquitectura 100% Offline (SPA):** Generación de bundles de datos estáticos en JavaScript que permiten utilizar el dashboard localmente o en GitHub Pages con latencia cero.

---

## Funcionalidades Principales

- **Selector y Buscador Dinámico de Campeones:** Catálogo con más de 30 campeones ordenados alfabéticamente de forma predeterminada, con filtro por rol canónico (Top, Jungla, Mid, Bot/ADC y Soporte).
- **Control de Rango de Parches en Tiempo Real:** Ajuste interactivo del intervalo temporal (parches 16.1 a 16.17+) que recalcula dinámicamente las métricas en el navegador.
- **Filtro de Cuota de Mercado:**
  - *Populares & Solidez:* Excluye opciones con menos del 0.5% del volumen de compras de su categoría para eliminar picks hiper-raros.
  - *Catálogo Completo:* Muestra el 100% de las opciones registradas para análisis de nicho y OTPs.
- **Algoritmo Smart Rank:** Clasificación compuesta que equilibra el valor de WPA con la confianza logarítmica del tamaño de muestra:
  $$\text{SmartScore} = \text{WPA}_{\text{recency}} \times (1 + 0.15 \times \log_{10}(\text{Muestra}))$$
- **Insignias Estadísticas Contextuales:**
  - `Meta`: Alto volumen de muestra con WPA positivo comprobado (excluye estrictamente WPA negativo).
  - `Situacional / Hidden OP`: Elevada tasa de victoria en condiciones o muestras específicas.
  - `Emergente`: Tendencia reciente al alza ($\Delta \text{WPA} > 0$).
  - `Ajustado`: Identifica cambios en la última versión analizada.
- **Vistas Especializadas:**
  - *Vista por Slots (Builds):* Desglose ordenado por Iniciales, Botas, 1º, 2º, 3º y 4º+ Objeto.
  - *Catálogo General:* Catálogo consolidado de todos los objetos sin restricción de slot.
  - *Bloques Situacionales:* Recomendaciones automáticas vs Daño Mágico, vs Daño Físico, vs Tanques, vs Squishies, vs Alto CC, con Ventaja y con Desventaja.

---

## Exportador de Conjuntos para League of Legends

El dashboard cuenta con un botón dividido (*split button*) que genera conjuntos de objetos listos para usar en partida:

### Opciones de Exportación
1. **Exportar Set Individual:** Copia al portapapeles o descarga en `.json` el set optimizado del campeón y rol seleccionado.
2. **Exportación Masiva Multi-Set:** Genera y procesa en un único paso todos los campeones y roles soportados en la estructura oficial multi-set de Riot Games:
   - **Orden Alfabético:** Los campeones se organizan de la A a la Z.
   - **Orden Canónico de Roles:** Para cada campeón, sus roles se ordenan estrictamente: **Top** $\to$ **Jungla** $\to$ **Mid** $\to$ **Bot/ADC** $\to$ **Support**.
   - Compatible tanto al **Copiar todos los sets** al portapapeles como al **Descargar archivo .json** consolidado.

### Cómo Importar en el Cliente de LoL
1. Abre el cliente de League of Legends.
2. Dirígete a **Colección** > **Objetos**.
3. Haz clic en **Importar conjuntos de objetos**.
4. Selecciona **Pegar conjunto copiado** (si usaste el portapapeles) o **Seleccionar un archivo** (si descargaste el `.json`).
5. ¡Todos tus sets quedarán guardados y asignados automáticamente a cada campeón en partida!

---

## Metodología Matemática

Para resolver el equilibrio entre solidez muestral y vigencia del meta, se implementa una media ponderada con decaimiento exponencial:

$$\text{WPA}_{\text{recency}} = \frac{\sum_{i=1}^N \text{WPA}(P_i) \times \text{Muestra}(P_i) \times \lambda^{(N - i)}}{\sum_{i=1}^N \text{Muestra}(P_i) \times \lambda^{(N - i)}}$$

Donde:
- $N$ es el índice del parche más reciente analizado.
- $i$ es el índice del parche del registro ($i \le N$).
- $\lambda = 0.75$ es la tasa de retención (vida media $\approx 2.41$ parches).

---

## Estructura del Repositorio

```
zinkoachless/
├── get-wpa.py                 # Extracción y almacenamiento en caché de estadísticas desde Coachless
├── patch_history.py           # Rastreador de cambios e historial de parches (DDragon)
├── process_wpa.py             # Agregación, ponderación y generación de docs/data.js
├── README.md                  # Documentación del proyecto
├── data/
│   ├── raw/                   # Datos brutos descargados en formato JSON
│   ├── processed/             # CSVs procesados e historial de ajustes
│   ├── consolidated/          # JSONs agregados globales
│   └── granular/              # JSONs de desglose por parche para el frontend
└── docs/                      # Aplicación Web Monopágina (SPA para GitHub Pages)
    ├── index.html             # Interfaz semántica y panel de control
    ├── styles.css             # Sistema de diseño, Glassmorphism y modo oscuro
    ├── app.js                 # Lógica interactiva, filtros y exportador
    └── data.js                # Bundle estático offline de datos
```

---

## Instalación y Configuración

### Requisitos Previos
- Python 3.10 o superior
- Administrador de paquetes `uv` (recomendado) o `pip`

### Configuración del Entorno Virtual

Activar el entorno existente con `uv`:
```bash
source .venv/bin/activate
```

O crear uno nuevo desde cero:
```bash
uv venv
source .venv/bin/activate
uv pip install requests pandas
```

---

## Pipeline de Actualización de Datos

Para actualizar las estadísticas ante nuevos parches de League of Legends:

```bash
# 1. Activar entorno virtual
source .venv/bin/activate

# 2. Descargar y auditar cambios de balance desde Riot DDragon
python3 patch_history.py

# 3. Descargar estadísticas de la API de Coachless (usa caché local)
python3 get-wpa.py

# 4. Procesar métricas y compilar el bundle docs/data.js
python3 process_wpa.py
```

---

## Cómo Añadir un Nuevo Campeón

1. **En `get-wpa.py`:** Añade la tupla de ID y rol a la lista `CHAMPIONS`:
   ```python
   # Roles: 0: Top, 1: Jungle, 2: Mid, 3: Bot, 4: Support
   CHAMPIONS.append((81, 3))  # Ejemplo: Ezreal Bot
   ```
2. **En `docs/app.js`:** Registra el nombre y los roles soportados en los mapeos:
   ```javascript
   championNames[81] = "Ezreal";
   championRolesMap[81] = [3, 2]; // Bot y Mid
   ```
3. **En `docs/index.html`:** Añade la opción correspondiente en el `<select id="champion-select">` respetando el orden alfabético:
   ```html
   <option value="81">Ezreal</option>
   ```
4. **Ejecutar el pipeline:**
   ```bash
   source .venv/bin/activate && python3 patch_history.py && python3 get-wpa.py && python3 process_wpa.py
   ```

---

## Despliegue

La carpeta `docs/` contiene una aplicación web cliente estática y autosuficiente. Para desplegarla:
- **GitHub Pages:** Configura la fuente de publicación en la rama principal seleccionando la carpeta `/docs`.
- **Localmente:** Puedes abrir directamente `docs/index.html` en tu navegador o servirla con cualquier servidor HTTP local:
  ```bash
  python3 -m http.server 8000 --directory docs
  ```

---

## Comandos Git para Publicar Cambios

Para guardar y subir las modificaciones al repositorio remoto, ejecuta en tu consola:

```bash
git add docs/ README.md memory-bank/
git commit -m "feat: split button de exportacion masiva y mejoras en dashboard"
git push origin main
```

