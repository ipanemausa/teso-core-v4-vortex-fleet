# TESO GROWTH OS: Ecosistema de Marketing Automatizado 🚀
> "El marketing del futuro no se siente como marketing. Se siente como inteligencia aplicada."

Este documento detalla la arquitectura estratégica para automatizar la adquisición, conversión y retención de clientes B2B (Empresas) y B2C (Ejecutivos de Alto Nivel).

---

## 1. ARQUITECTURA DEL ECOSISTEMA (El "Stack" Tecnológico)

Para que funcione solo, necesitamos conectar estos 4 cerebros:

| Módulo | Herramienta Sugerida | Función en TESO |
| :--- | :--- | :--- |
| **Cerebro de Datos (CRM)** | **HubSpot** / Salesforce | Centraliza toda la info. Si un CEO abre el Demo, el CRM lo sabe. |
| **Motor de Tracción (Ads)** | **LinkedIn Ads** (Hyper-Targeting) | Solo mostramos anuncios a "Gerentes de RRHH" en Medellín. |
| **Conversación (Bot)** | **WhatsApp Business API** (ManyChat) | Cierra la venta, agenda recogidas y resuelve dudas 24/7. |
| **Automatización (Pegamento)** | **Zapier** / Make | Conecta: "Nuevo Lead LinkedIn" -> "Mandar WhatsApp Bienvenida". |

---

## 2. ESTRATEGIA DE ADQUISICIÓN ("El Francotirador B2B")

No dispares al aire. Teso busca las 50 empresas más grandes.

### Táctica A: "El Caballo de Troya" (Auditoría Gratuita)
1.  **El Gancho:** Anuncio en LinkedIn: *"¿Sabe cuánto pierde su empresa en tiempos de espera de sus ejecutivos? Descúbralo en 3 clics."*
2.  **La Herramienta:** Una Landing Page donde suben un excel simple de sus gastos de transporte actuales.
3.  **El Resultado:** Teso genera un PDF automático: *"Podrían ahorrar $45M al año optimizando rutas con Teso"*.
4.  **El Cierre:** *"Agenda tu Demo Vip con una flota blindada gratis para probar."*

### Táctica B: "Account-Based Marketing" (ABM)
1.  **Scraping Ético:** Usamos IA para detectar cuando un directivo de Bancolombia viaja a Bogotá.
2.  **Impacto Contextual:** Enviar un email/InMail justo antes de su viaje: *"Sabemos que viajas el martes. Tu transporte al JMC ya está pre-asignado en este link si lo deseas."*

---

## 3. ESTRATEGIA DE CONVERSIÓN ("El Show Room Digital")

Aquí es donde nuestro **MVP (src/App.jsx)** brilla. No hacemos powerpoints aburridos.

1.  **El Demo Interactivo:** En lugar de una reunión de Zoom, les mandamos el link del **"Centro de Control Teso"** (el que construimos).
2.  **Gamificación:** Les dejamos oprimir el botón *"DÍA CRÍTICO"* para que vean cómo nuestra IA resuelve problemas.
3.  **Efecto WOW:** Al ver el panel de "FINANZAS" y "MERCADEO" funcionando en vivo, la venta es técnica, no emocional. Es irrefutable.

---

## 4. ESTRATEGIA DE RETENCIÓN ("El Mayordomo IA")

Una vez son clientes, la IA los "mima" para que nunca se vayan.

### Loop de WhatsApp (Viajes):
*   **06:00 AM:** *"Buenos días Dr. Pérez. Su vuelo es a las 9am. El tráfico está pesado. Su conductor Juan (Toyota TES-901) llegará 10 min antes (6:50am) para asegurar su llegada. ¿Desea café a bordo?"*
*   **Acción:** Botones rápidos: `[Sí, negro] [No, gracias]`.

### Loop de Finanzas (Para el CFO):
*   **Viernes 4 PM:** Email automático al Gerente Financiero.
*   **Contenido:** *"Reporte Semanal: Teso ahorró 15 horas hombre y redujo la huella de carbono 2 toneladas esta semana. Factura consolidada adjunta."*

---

## 5. ESTRATEGIA DE REFERIDOS ("Viralidad Corporativa")

*   **Campaña:** "Beneficio para Empleados".
*   **Mecánica:** Si la empresa firma contrato, todos sus empleados reciben acceso a "Teso Personal" para sus fines de semana con tarifas preferenciales.
*   **Efecto:** Conviertes a 500 empleados en embajadores de tu marca un sábado por la noche.

---

## RESUMEN DE IMPLEMENTACIÓN INICIAL (MVP)

1.  **Semana 1:** Configurar **LinkedIn Ads** segmentado (Geo: Medellín, Cargo: Directivos).
2.  **Semana 2:** Conectar **WhatsApp Business API** al MVP para enviar confirmaciones reales.
3.  **Semana 3:** Crear el PDF de "Reporte de Ahorro y Sostenibilidad" para usar como gancho de venta.

> **Teso no vende transporte. Vende Control, Tiempo y Status.**
