# 🚀 Protocolo de Flujo de Trabajo V3 (DevOps)

Este documento define el estándar profesional para el desarrollo, prueba y despliegue de **Teso Core V3 (Vortex)**, garantizando persistencia y estabilidad.

## 🏗️ Arquitectura de Entornos

| Entorno | Infrastructura | Propósito | Comando Clave |
| :--- | :--- | :--- | :--- |
| **1. LOCAL** | PC / Localhost | Iteración rápida, UI dev, Fixes. | `npm run dev` |
| **2. CONTAINER** | Docker Local | "Congelar" dependencias. Validar Build real. | `docker build .` |
| **3. STAGING** | Fly.io | Pruebas en nube, acceso remoto, validación final. | `fly deploy` |
| **4. PROD** | Hugging Face | **Solo exhibición final**. Se actualiza desde Main. | `git push production` |

---

## 🔄 El Ciclo de Vida (Paso a Paso)

### FASE 1: Desarrollo Local (Taller)
1.  Realizar cambios en código (`App.jsx`, `main.py`).
2.  Prueba rápida: `npm run dev` (Frontend) + `uvicorn main:app` (Backend).
3.  **Checkpoint:** Si funciona, proceder a Fase 2.

### FASE 2: Empaquetado (El "Freezer")
1.  Construir imagen Docker para verificar que *todo* compila junto.
    ```bash
    docker build -t teso-v3-local .
    docker run -p 7860:7860 teso-v3-local
    ```
2.  Verificar en `http://localhost:7860`. Si falla aquí, **NO SUBIR**.

### FASE 3: Staging (El Ensayo General)
1.  Desplegar a Fly.io (Entorno barato y volátil).
    ```bash
    fly deploy
    ```
2.  Verificar en `https://teso-v3-staging.fly.dev`.
3.  Compartir URL con stakeholders para aprobación.

### FASE 4: Producción (El Estreno)
1.  Solo si FASE 3 es exitosa:
    ```bash
    git add .
    git commit -m "chore: release v3.x"
    
    # El remoto 'production' apunta al Space: https://huggingface.co/spaces/GuillermoHoyos/teso
    git push production main
    ```
2.  Hugging Face detectará el cambio y reconstruirá automáticamente.

---

## 📂 Archivos de Infraestructura
*   **`Dockerfile`**: Receta maestra. Construye Frontend (Vite) y Backend (FastAPI) en una sola imagen.
*   **`fly.toml`**: Configuración para la nube de Staging.
