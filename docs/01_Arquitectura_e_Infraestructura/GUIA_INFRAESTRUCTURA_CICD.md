# 🚀 Guía de Infraestructura Ninja: CI/CD para TESO

> **"La tecnología de las grandes corporaciones, ahora en tus manos."**

Esta guía explica la arquitectura profesional que hemos implementado para TESO. Ya no dependemos de "suerte" o de tener el PC prendido. Tenemos un sistema autónomo.

## 🧠 Concepto Clave: CI/CD
**CI (Integración Continua) / CD (Despliegue Continuo)**

Significa **automatizar todo**. En lugar de copiar archivos manualmente a un servidor (como se hacía en los 90s), creamos una "tubería" digital.

1.  Tú guardas código (**Commit**).
2.  Tú envías a la nube (**Push**).
3.  **El Sistema (Vercel)** detecta el cambio, construye la app y la actualiza en segundos.

---

## 🏗️ Nuestra Arquitectura

### 1. El Taller (Tu PC - Localhost)
*   **Herramienta:** VS Code + Terminal (`npm run dev`).
*   **Función:** Aquí rompes, pruebas y creas. Es tu laboratorio privado.
*   **Link:** `http://localhost:5173`

### 2. La Bóveda (GitHub - Repositorio)
*   **Herramienta:** Git.
*   **Función:** Guarda la "Verdad Absoluta" del código. Si tu PC explota, el código está a salvo aquí. Es privado y seguro.
*   **Link:** [Ver Repositorio](https://github.com/ipanemausa/https-github.com-ipanemausa-teso)

### 3. El Escenario (Vercel - Producción)
*   **Herramienta:** Vercel Cloud.
*   **Función:** Muestra tu obra al mundo. Es el "Link Eterno" para clientes e inversores.
*   **Link:** [Ver App en Vivo](https://https-github-com-ipanemausa-teso.vercel.app/)

---

## ⚡ Tu Nuevo Flujo de Trabajo "Berraquera"

Cada vez que quieras actualizar la App mundial:

1.  Haces tus cambios en VS Code.
2.  Vas al icono de **Source Control** (el de las 3 líneas).
3.  Escribes un mensaje y das **Commit**.
4.  Das clic en **Sync / Push**.
5.  **¡LISTO!** Esperas 2 minutos y Vercel actualiza el mundo solo.

---

## 🎮 Centro de Mando
Para no perderte nunca, usa siempre tu tablero de control:
👉 **`docs/TESO_MISSION_CONTROL.html`** (Guardado en tus favoritos como "TESO TOTAL").
