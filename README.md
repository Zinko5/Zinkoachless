# Zinkoachless ⚡

**Zinkoachless** es un agregador dinámico y visualizador de estadísticas multiparche de **Win Probability Added (WPA)** para League of Legends, diseñado para analizar el impacto real de objetos, runas y hechizos de invocador.

El nombre del proyecto rinde homenaje a la API de origen de las estadísticas (Coachless) combinada con el motor personalizado del proyecto.

---

# Resumen del Proyecto: Bypass y Agregación WPA Multiparche

### Objetivo
Construir una base de datos local con estadísticas de rendimiento (**WPA** - *Win Probability Added*) consolidadas a lo largo de múltiples versiones para descubrir *builds off-meta* y estrategias ocultas viables.

---

### El Problema
* **Muestra insuficiente:** En un solo parche, los objetos y runas poco convencionales se juegan muy pocas veces. Su WPA no es estadísticamente fiable y la interfaz los muestra en gris o los descarta por ruido.
* **Muro de pago:** La función nativa de filtrado y agregación multiparche (*Multi Patch Filtering*) es exclusiva de **Coachless Premium**.

---

### Solución Implementada
1. **Extracción directa de la API:** Se interceptaron las peticiones `POST` (código `200`) a los endpoints de Coachless (`GetGlobalItemStatistics`, `GetKeystoneData`, etc.), automatizando la descarga de datos parche por parche desde la versión 16.1 hasta la actual.
2. **Cálculo del WPA Ponderado:** Se unificó la muestra de todos los parches mediante la fórmula de promedio ponderado:
   $$\text{WPA Total} = \frac{\sum (\text{WPA}_i \times \text{Compras}_i)}{\sum \text{Compras}_i}$$
3. **Mapeo de Metadatos:** Se consumieron los JSON oficiales del CDN de Riot Games (DDragon) para cruzar los IDs con sus nombres correspondientes en inglés e imágenes reales.
4. **Resultado:** Datos consolidados y confiables en JSON/CSV listos para usar en una web propia sin depender de la suscripción de pago.

---

## 🚀 Características Clave

*   **Soporte Multicampeón Dinámico:** Selector en tiempo real para cambiar instantáneamente entre **Lucian** y **Smolder**.
*   **Descargador Inteligente con Caché (`get-wpa.py`):** 
    *   Determina qué parches ya han sido descargados para guardarlos en memoria caché local.
    *   **Omite** la descarga de parches estáticos pasados y **actualiza únicamente el parche actual en curso** o los nuevos parches añadidos.
    *   Implementa reintentos automáticos con protección ante cortes de conexión o sobrecarga de red en el servidor.
*   **Mapeo y Agregación Automatizada (`process_wpa.py`):**
    *   Cruza dinámicamente los IDs con sus nombres correspondientes en inglés usando el CDN oficial de Riot Games (DDragon).
    *   Genera automáticamente el archivo web de datos estáticos (`docs/data.js`) para garantizar que la web cargue 100% sin conexión.
*   **Filtro por Rango de Parches en Tiempo Real:** 
    *   Los selectores de parche **From** y **To** permiten al usuario delimitar qué parches del año quiere tomar en cuenta.
    *   JavaScript recalcula en milisegundos en el navegador el **promedio de WPA ponderado** y la **suma total de muestras (partidas/compras)** para cada elemento.
*   **Interfaz de Usuario Premium:**
    *   Estética oscura siguiendo guías Sleek/Minimalist en Vanilla CSS.
    *   Mapeo dinámico de iconos de alta calidad directamente desde el CDN de Riot.
    *   Ordenamiento dinámico interactivo: permite ordenar todas las categorías tanto por impacto WPA como por popularidad (compras/picks) haciendo clic directamente en los encabezados de las columnas.

---

## 📁 Estructura del Proyecto

```
wpa/
├── get-wpa.py                 # Descarga y almacenamiento en caché de estadísticas raw
├── process_wpa.py             # Agregación, mapeo y automatización de data.js
├── README.md                  # Documentación del proyecto
├── data/                      # Directorio organizado de base de datos local
│   ├── raw/                   # JSONs brutos descargados (memoria caché)
│   ├── processed/             # CSVs procesados listos para Excel/Google Sheets
│   ├── consolidated/          # JSONs agregados globales completos (WPA promedio anual)
│   └── granular/              # JSONs de desglose granular por parches para la web
└── docs/                      # Aplicación Web Monopágina (SPA) y despliegue GitHub Pages
    ├── index.html             # Marcado semántico y estructura del dashboard
    ├── styles.css             # Estilos de diseño e interactividad (Vanilla CSS)
    ├── app.js                 # Lógica, agregación ponderada y filtros en navegador
    └── data.js                # Copia de seguridad local para funcionamiento offline
```

---

## 🛠️ ¿Cómo añadir un nuevo campeón?

Si deseas incorporar un nuevo campeón (por ejemplo, **Ezreal** con ID `81`), solo debes realizar estas 3 pequeñas ediciones:

1.  **En [`get-wpa.py`](file:///home/zinko/publico/wpa/get-wpa.py):** Agrega su ID a la lista de extracción:
    ```python
    CHAMPIONS = [236, 901, 81]
    ```
2.  **En [`docs/app.js`](file:///home/zinko/publico/wpa/docs/app.js):** Agrega su nombre y rol en inglés en los diccionarios de cabecera:
    ```javascript
    const championNames = { 236: "Lucian", 901: "Smolder", 81: "Ezreal" };
    const championRoles = { 236: "Tirador / ADC", 901: "Tirador / ADC", 81: "Tirador / ADC" };
    ```
3.  **En [`docs/index.html`](file:///home/zinko/publico/wpa/docs/index.html):** Agrega la opción al menú desplegable:
    ```html
    <select id="champion-select">
      <option value="236">Lucian</option>
      <option value="901">Smolder</option>
      <option value="81">Ezreal</option>
    </select>
    ```
4.  **Ejecuta de nuevo los scripts:** `python3 get-wpa.py && python3 process_wpa.py` (el caché inteligente ignorará a los campeones que ya tienes y descargará los nuevos datos en segundos).
