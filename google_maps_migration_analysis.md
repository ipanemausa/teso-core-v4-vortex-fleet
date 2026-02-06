# Análisis de Migración a Google Maps API

## 1. Viabilidad
**SÍ, es totalmente posible** reemplazar Leaflet con Google Maps API.

## 2. Ventajas ("Por qué es más real")
*   **Datos de Tráfico en Vivo:** Google Maps ofrece la capa de tráfico más precisa del mundo.
*   **Street View:** Integración nativa para ver las calles reales.
*   **Estabilidad:** "Siempre funciona" (SLA garantizado por Google).
*   **Look & Feel:** Los usuarios confían en la estética de Google.

## 3. Capas Compatibles
Si migramos, **SÍ** podremos usar todas las capas que necesitamos, pero requieren adaptación:

### A. Capa de Flota (Vehículos y Aviones)
*   **Leaflet (Actual):** Usa `DivIcon` (CSS puro) para los puntos pulsantes neón y rotación de imágenes.
*   **Google Maps:** Necesitaremos usar `OverlayView` (más avanzado) para lograr los mismos efectos de neón/animación, o simplificarlos a imágenes estáticas (`Marker`).

### B. Capa de Rutas (Polilíneas)
*   Google Maps maneja líneas nativamente. Se verán igual o mejor.

### C. Capa de Calor (Heatmaps)
*   Google Maps tiene una librería de visualización excelente para mapas de calor.

## 4. Requisitos Críticos (Lo que necesito de ti)
Para proceder, necesito una **Google Maps API Key**.

Esta llave debe tener habilitados los siguientes servicios en la Google Cloud Console:
1.  **Maps JavaScript API** (Para el mapa web).
2.  **Places API** (Si queremos autocompletar direcciones).
3.  **Directions API** (Para rutas reales).

> ⚠️ **Nota:** Google Maps requiere una tarjeta de crédito en la cuenta de Google Cloud para facturación (aunque tienen una capa gratuita generosa).

## 5. Plan de Acción (Si decides proceder)
1.  Instalar `@react-google-maps/api`.
2.  Crear un nuevo componente `GoogleLiveOpsMap`.
3.  Reescribir `CoreOperativo` para usar la sintaxis de Google (`<GoogleMap>` en vez de `<MapContainer>`).
4.  Adaptar los marcadores de Aviones y Autos.

---
**Mi recomendación:**
Acabo de subir un arreglo ("Fix: Map rendering layout") que soluciona el "descontrol" visual (el mapa pequeño o tapado). **Por favor verifica si ese arreglo ya te satisface.** Si no, dame la API Key y migramos a Google Maps de inmediato.
