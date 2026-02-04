# TESO CORE: ANÁLISIS DOFA (SWOT) - Q1 2026

> **Contexto:** Evaluación estratégica tras la crisis de estabilidad del Dashboard y la redefinición hacia una Arquitectura Multi-Agente.

---

## 🟢 FORTALEZAS (INTERNAL STRENGTHS)
*Lo que ya tenemos y funciona bien.*

1.  **Core Tecnológico Avanzado:** Capacidad probada de integración de Mapas en Tiempo Real (Leaflet) + Agentes de Voz (ElevenLabs) en una sola interfaz web.
2.  **Dataset V4 Validado:** Poseemos un activo valioso: la data histórica real (14,400 filas) que permite simulaciones de alta fidelidad, algo que la competencia no tiene.
3.  **Agilidad de Desarrollo:** Capacidad de "Amputación y Restauración" (Surgical Fixes) en minutos usando Agentes de Código.
4.  **UX "Wow Factor":** Diseño visual Neon/Cyberpunk que genera impacto inmediato en demos y stakeholders.

## 🔴 DEBILIDADES (INTERNAL WEAKNESSES)
*Lo que nos frena y debemos arreglar.*

1.  **Arquitectura Monolítica (Frontend):** El `OperationalDashboard` concentra demasiadas responsabilidades (Mapa + Finanzas + UI). Esto hace que el sistema sea frágil ante cambios menores.
2.  **Bloqueo del Main Thread:** El procesamiento de datos masivos (Excel Parsing) congela la interfaz visual, degradando la experiencia "Premium".
3.  **Silos de Información:** Los agentes (Dispatch, Finance) no comparten un "Cerebro Central" en tiempo real. Toman decisiones aisladas.
4.  **Ausencia de Tests Automáticos:** Dependemos de "probar en vivo", lo que aumenta el riesgo de regresiones en producción.

## 🔵 OPORTUNIDADES (EXTERNAL OPPORTUNITIES)
*Hacia dónde podemos crecer.*

1.  **Evolución a SaaS (Software as a Service):** Si desacoplamos los módulos, podemos vender el "Módulo de Mapa" a una empresa y el "Módulo de Finanzas" a otra.
2.  **Integración "Physical AI":** Conectar el sistema a sensores IoT reales de los vehículos (combustible, frenos) para que el Agente de Mantenimiento actúe solo.
3.  **Predicción de Demanda:** Usar la data histórica V4 no solo para simular, sino para *predecir* dónde estarán los clientes mañana (AI Forecasting).
4.  **Orquestación de Agentes ("Swarm"):** Implementar el modelo "Triunvirato" (Estratega-Analista-Ejecutor) para automatizar la gerencia completa, no solo tareas aisladas.

## 🟠 AMENAZAS (EXTERNAL THREATS)
*Riesgos del entorno.*

1.  **Escalabilidad del Navegador:** Si la flota crece a 10,000 unidades, el navegador (Client-Side) colapsará. Necesitamos mover lógica al Backend (Python) urgente.
2.  **Deuda Técnica Acumulada:** Si seguimos "parcheando" rápido sin refactorizar, el código se volverá inmanejable en 3 meses.
3.  **Complejidad Cognitiva:** El sistema se está volviendo difícil de entender para un desarrollador nuevo (o para nosotros mismos en el futuro) sin documentación estricta.
4.  **Dependencia de APIs Externas:** Si Mapbox o ElevenLabs suben precios o cambian APIs, partes críticas del sistema podrían detenerse.

---

## 🎯 ESTRATEGIA DE CRUCE (CAME)

*   **CORREGIR (Debilidades):** Ejecutar la **Refactorización Modular** inmediatamente. Separar el Mapa de las Finanzas.
*   **AFRONTAR (Amenazas):** Migrar el procesamiento pesado al Backend (Python) para quitar carga al navegador.
*   **MANTENER (Fortalezas):** Seguir iterando rápido pero con "Guardrails" (Tests).
*   **EXPLOTAR (Oportunidades):** Lanzar el "Agente Orquestador" que conecte las piezas sueltas.
