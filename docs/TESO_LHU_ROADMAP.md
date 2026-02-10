
# REPORTE DE ESTRATEGIA Y ESTADO DEL PROYECTO TESO

**PARA:** Liverpool Hope University (LHU)  
**DE:** Guillermo Hoyos  
**FECHA:** 10 de Febrero, 2026  
**ASUNTO:** Evaluación Crítica de Arquitectura, Lecciones Aprendidas y Solicitud de Apoyo para Escalamiento IA

---

## 1. RESUMEN EJECUTIVO
Este documento presenta un análisis honesto y técnico de la evolución de la plataforma TESO (Transporte Ejecutivo y Servicios Operativos). A la fecha, hemos logrado desplegar un núcleo operativo funcional en la nube (Fly.io), pero hemos encontrado fricción estratégica al intentar escalar capacidades de Inteligencia Artificial (IA) generativa mediante Hugging Face.

Reconocemos que en el afán de demostrar capacidades de IA ("Gemini Artifact"), sacrificamos temporalmente la integridad de la lógica de negocio (el "Core Financiero" basado en Excel), creando una disonancia entre la operación real y la visualización. Este reporte detalla nuestro camino técnico, justifica las decisiones tomadas y plantea una nueva hoja de ruta para la cual solicitamos su validación y apoyo.

---

## 2. RECUENTO DE LA EVOLUCIÓN ARQUITECTÓNICA
Hemos iterado a través de tres fases distintas para encontrar el equilibrio entre operatividad y capacidades cognitivas.

### FASE 1: Prototipado Ágil (Vercel)
*   **Tecnología:** React frontend.
*   **Objetivo:** Validar la interfaz de usuario (UI) y la experiencia de "Centro de Comando".
*   **Limitación:** Era una "cáscara vacía". No tenía backend, base de datos ni persistencia real.
*   **Estado:** Deprecado en favor de soluciones Full-Stack.

### FASE 2: El Núcleo Operativo (Fly.io) - "La Roca"
*   **Tecnología:** Docker Container (Python FastAPI + React).
*   **Logro:** Conseguimos un despliegue **estable, robusto y profesional**.
*   **Funcionalidad:**
    *   Conexión real con `TESO_EDGE_DOCUMENT_VIVO.xlsx` como base de datos.
    *   Simulación de agentes en tiempo real.
    *   Mapeo geo-espacial funcional.
*   **Justificación:** Fly.io nos da infraestructura de "Grado Militar". Es rápido, escala bien y es agnóstico a la nube. **Esta es nuestra versión más exitosa a nivel de ingeniería de sistemas.**

### FASE 3: El Escalamiento Cognitivo (Hugging Face Spaces)
*   **Objetivo:** Integrar Modelos de Lenguaje (LLMs) nativos para transformar TESO de una herramienta de gestión a un "Analista Inteligente".
*   **Justificación:** Fly.io tiene limitaciones de hardware (GPUs costosas) para correr modelos de IA pesados. Hugging Face ofrece un ecosistema nativo para esto.
*   **El Error Táctico:** Intentamos replicar *toda la aplicación* en Hugging Face en lugar de usarlo solo como un microservicio de inteligencia. Esto duplicó esfuerzos y creó confusión sobre cuál era la "fuente de la verdad".

---

## 3. ANÁLISIS DEL "ARTEFACTO GEMINI" Y LA LÓGICA DE NEGOCIO
Recientemente introdujimos el "Gemini Consultant Artifact" para demostrar capacidades de IA a la universidad. Sin embargo, identificamos un error crítico en esta implementación:

1.  **Desacople de Datos:** Para hacer la demo visualmente impactante, el artefacto se alimentó con "Datos Sintéticos" (Mock Data) estáticos, desconectándose del archivo maestro `TESO_EDGE_DOCUMENT_VIVO.xlsx`.
2.  **Pérdida de Realidad:** Al hacerlo, el sistema dejó de reflejar la realidad operativa (Agenda del Día vs. Agenda del Administrador). El Core Financiero dejó de recalcularse basado en viajes reales, volviéndose una "pantalla bonita" sin sustento matemático.
3.  **Confusión de Identidad:** La aplicación pasó de ser una herramienta operativa (ERP) a una presentación de ventas (Deck), perdiendo su valor principal.

**Conclusión:** La IA no debe reemplazar los datos operativos, debe **leerlos y opinar sobre ellos**.

---

## 4. DESAFÍOS Y SOLICITUD DE APOYO
Nos encontramos en un punto de inflexión donde tenemos la capacidad operativa (Fly.io) y la capacidad visual/demo (Hugging Face), pero necesitamos unificarlas correctamente.

### Limitaciones Actuales en Fly.io
*   **Capacidad de Cómputo:** Ejecutar inferencia de IA localmente en los contenedores gratuitos/básicos de Fly.io es lento o imposible por falta de RAM/GPU.
*   **Integración:** Necesitamos una forma eficiente de que el núcleo en Fly.io envíe datos a un "Cerebro" externo sin latencia excesiva.

### Solicitud a LHU
Buscamos orientación técnica y estratégica en los siguientes puntos:

1.  **Arquitectura Híbrida:** ¿Cómo recomiendan conectar nuestro núcleo transaccional (Fly.io) con servicios de inferencia (Hugging Face/Gemini API) manteniendo la integridad de los datos?
2.  **Validación de Modelo de Datos:** Necesitamos revisar nuestro esquema de Excel (`TESO_EDGE_DOCUMENT_VIVO.xlsx`) para asegurar que sea consumible por agentes de IA sin alucinaciones.
3.  **Estrategia de Despliegue:** Queremos volver a centrar el desarrollo en Fly.io como la plataforma oficial, degradando Hugging Face a un rol de "Laboratorio Experimental" o "API de Inteligencia".

---

## 5. PRÓXIMOS PASOS INMEDIATOS (Internal Roadmap)
Para corregir el rumbo antes de la presentación final:

1.  **Restaurar la Verdad en Fly.io:** Revertir los cambios visuales que ocultan los datos reales del Excel. El panel "Operaciones" debe mostrar el Excel, no datos falsos.
2.  **Gemini como "Capa", no "Reemplazo":** Reintegrar el agente de Gemini como un botón que abre un panel lateral de consulta ("Consultar estado de la flota"), leyendo los datos que YA existen en pantalla.
3.  **Unificar Despliegues:** Detener el mantenimiento activo de la versión completa en Hugging Face y enfocar todos los recursos en la estabilidad de Fly.io.

---
*Este documento sirve como base para nuestra tutoría y defensa de proyecto.*
