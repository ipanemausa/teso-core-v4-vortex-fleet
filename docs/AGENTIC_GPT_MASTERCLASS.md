![alt text](image.png)# AGENTIC AI BLUEPRINT: FROM PROMPT TO AUTONOMY
> **Artifacto de Estudio - Preparación Clase GPT Agents**
> *Objetivo: Entender y diseñar arquitecturas agénticas avanzadas usando modelos GPT.*

## 1. ¿Qué define a la "IA Agéntica"? (The Agency Loop)
A diferencia de un Chatbot normal (Input -> Output), un Agente tiene un **Bucle de Control**:
1.  **PERCEPTION (Ver):** Recibe el estado del entorno (ej. base de datos, saldo banco, mensaje usuario).
2.  **BRAIN (Pensar):** El LLM (GPT-4) no solo responde, sino que **razona** un plan.
3.  **TOOLS (Actuar):** Tiene "manos" (API Calls, Python Code, Web Search) para ejecutar acciones.
4.  **FEEDBACK (Observar):** Ve el resultado de su acción y decide si terminó o necesita corregir.

---

## 2. Arquitectura "ReAct" (Reasoning + Acting)
Este es el estándar de oro que estudiarás hoy.
*Prompt del Sistema (System Prompt):*
> "Eres un experto financiero. Tienes acceso a una calculadora y a la base de datos SQL.
> PREGUNTA: ¿Es la empresa rentable hoy?
> 
> PENSAMIENTO 1: Necesito saber los ingresos y gastos de hoy. Buscaré en la DB.
> ACCIÓN 1: `query_sql('SELECT * FROM sales WHERE date = today')`
> OBSERVACIÓN 1: Ingresos = $1000. Gastos = Desconocido.
> PENSAMIENTO 2: Me faltan los gastos. Buscaré en la tabla de costos.
> ACCIÓN 2: `query_sql('SELECT * FROM costs')`
> ..."

**Diferencia Clave:** El modelo **habla consigo mismo** antes de responderte.

---

## 3. Niveles de Automatización en GPTs
Para tu clase, distingue estos 3 niveles:

### Nivel 1: The Advisor (Como nuestro FinancialAgent actual)
*   **Input:** Datos fijos (JSON).
*   **Process:** Analiza con un Prompt.
*   **Output:** Texto/Recomendación.
*   *Limitación:* No puede buscar más info por su cuenta.

### Nivel 2: The Tool User (Function Calling)
*   **Input:** Objetivo vago ("Mejorar rentabilidad").
*   **Process:** El GPT decide qué función llamar (`get_financials()`, `send_email_support()`).
*   **Output:** Ejecuta la función y te reporta.

### Nivel 3: The Validated Agent (OODA Loop - Observe, Orient, Decide, Act)
*   **Capacidad:** Auto-corrección.
*   *Ejemplo:* Intenta pagar una nómina -> Falla por fondos -> **Decide** transferir de ahorros -> Reintenta pago -> Éxito -> Reporta.

---

## 4. Diseño de un "TESO GPT" (Caso de Uso Real)
Cómo aplicaríamos esto en tu proyecto TESO Core:

**Rol:** `Dispatch_Orchestrator_GPT`
**Herramientas (Tools) a darle:**
1.  `get_fleet_status()`: Ver dónde están los carros.
2.  `assign_route(drive_id, route_id)`: Asignar viaje.
3.  `voice_broadcast(msg, emotion)`: Hablar por el radio (Tu VoiceSystem).

**Script de Comportamiento (System Prompt):**
```markdown
Eres el Jefe de Operaciones de TESO. Tu misión es maximizar la eficiencia de la flota.
REGLAS:
1. Nunca asignes viajes a conductores cansadors (>8 horas).
2. Si llueve (usa `get_weather`), reduce la velocidad promedio.
3. Si hay un VIP (Bancolombia), asígnale un "Conductor Estrella".
```

---

## 5. Glosario para la Clase
*   **Context Window:** La memoria a corto plazo del agente.
*   **System Message:** La personalidad inmutable y reglas.
*   **Temperature:** Creatividad (0 = Robot preciso, 1 = Poeta loco). Para Finanzas u Ops, usa 0.1.
*   **Chain of Thought (CoT):** Pedirle al modelo "Piensa paso a paso" para mejorar la lógica.

---

> **Nota para el Usuario:** Este documento está diseñado para ser impreso o leído como "Cheat Sheet" durante tu clase.

---

## 6. MÓDULO 3: DESPLIEGUE TÁCTICO (EL VIAJE DEL HÉROE DE APRENDIZAJE)
*Estructura de la Clase Actual:*

### 🏠 ORDINARY WORLD (Mundo Ordinario)
Estado inicial del estudiante antes de la IA Agéntica.

### 📯 CALL TO ADVENTURE (La Llamada)
La oportunidad de construir equipos de Agentes GPT autónomos.

### 🤔 REFUSAL (El Rechazo)
Dudas y desafíos iniciales sobre la complejidad.

### ⚔️ CROSSING (El Umbral)
Primer despliegue real de un agente. (Deployment)

### 🛠️ TESTS (Pruebas y Aliados)
Debugging, refinamiento de prompts y herramientas.

### ✨ RESURRECTION (El Clímax)
El momento "Eureka" donde el agente funciona autónomamente.

### 🏆 RETURN (El Regreso con el Elixir)
Aplicación del conocimiento en proyectos reales (como TESO Core).

## 7. EVOLUCIÓN: DE INDIVIDUO A ENJAMBRE (SWARM)
*Tu transformación hoy:*

### 📍 ANTES (Nivel 1-2)
*   Custom GPTs aislados.
*   Dependencia de Prompts manuales.
*   Herramientas básicas (una a la vez).

### 🚀 AHORA (Nivel 3 - Multi-Agente)
*   **El Poder del Equipo:** 3 Agentes especializados > 1 Agente generalista experto.
*   **KPIs de Impacto:**
    *   ⚡ **3x** Tareas completadas simultáneamente.
    *   ⏱️ **80%** Menos tiempo de gestión manual (Human-in-the-loop reducido).
*   **Concepto Clave:** "Orquestación". Alguien debe dirigir a los agentes (El Manager GPT).

## 8. HOJA DE RUTA DE TRANSFORMACIÓN (3 PASOS)

### 01 🧠 ENTENDER (Mindset)
El secreto de las empresas Top: No usan la IA sola, usan **equipos coordinados**.

### 02 ⚡ CREAR (Build)
Construirás tu equipo en vivo mediante 6 preguntas clave.
*Resultado:* Manuales técnicos listos.

### 03 🚀 DESPLEGAR (Deploy)
Resultados reales en < 48 horas.

---
### 🎁 ENTREGABLES DE HOY (TU INVENTARIO)
1.  🧠 **Nueva Mentalidad:** De Operador manual a "Comandante de Agentes".
2.  📋 **3 Manuales Técnicos:** Listos para copiar y pegar (System Instructions).
3.  ⚡ **Sistema @ Funcional:** La sintaxis para invocar agentes específicos en ChatGPT (`@FinancialAgent`, `@CodeAgent`, etc).

## 9. TU COMPROMISO (EL PACTO)
*Para cruzar el umbral:*
1.  **Mentalidad de Aprendiz:** Humildad para aprender de cero.
2.  **Cuestionamiento Continuo:** No aceptar el primer output de la IA ("¿Es este el mejor prompt?").
3.  **Apalancamiento:** Usar el equipo de soporte.

> **¿CUENTO CONTIGO?** -> *Quiero verlo en el chat.*

### 💭 DUDAS COMUNES (OBJECCIONES)
*   **¿Es muy técnico?** -> Si sabes escribir un email, sabes coordinar agentes. Cero código.
*   **¿Es seguro?** -> Los agentes se validan entre ellos (Check Layer).
*   **¿Vale la pena?** -> 1 Equipo de Agentes = 3 Empleados Junior 24/7 por 20€/mes.
*   **¿Cuánto toma?** -> **LO HARÁS AHORA.** En esta sesión.

## 10. EL UMBRAL: ¿QUÉ ES AGENTIC AI? (ACTO 4)
*Definición:* Sistemas de IA capaces de **Percibir, Decidir y Actuar** autónomamente. (No solo Chat).

> 📊 **Dato McKinsey 2024:**
> Agentes coordinados mejoran productividad **40-60%** vs IA tradicional (Chatbots aislados).

## 11. LOS 3 AGENTES ESENCIALES (EL TRIUNVIRATO)
*El equipo mínimo viable:*

### 🎖️ AGENTE 1: Capitán de Marca (Estratega)
*   **Rol:** Conoce TODO sobre tu empresa (Misión, Tono, Valores). Valida que nada salga "fuera de marca".
*   **Input:** Contexto Estratégico.

### 🎯 AGENTE 2: Soldado de Ventas (Analista)
*   **Rol:** Experto en cualificación. Lee leads, detecta oportunidades y asigna "Temperatura" (Cold/Warm/Hot).
*   **Action:** Scoring de Leads.

### ✉️ AGENTE 3: Soldado de Email MKT (Ejecutor)
*   **Rol:** Copywriter persuasivo. Escribe secuencias de conversión basadas en la temperatura del lead.
*   **Output:** Borradores de campañas.

## 12. CONSTRUYE TU EQUIPO (ACTO 5 - BUILD)
*Proceso Interactivo en Clase:*
1.  **Datos Básicos:** Nombre Negocio + Sector.
2.  **Selección de Agentes:** Recomendado activar los 3 para máxima coordinación.
3.  **Preguntas de Personalización:** La IA te hace preguntas para afinar cada Prompt.

## 13. LA EPIFANÍA (ACTO 6 - RESURRECTION)
> 💡 **INSIGHT SUPREMO:**
> "No construyes herramientas. **Construyes un equipo.**"
> 
> *La diferencia entre usar un martillo (Tool) y contratar a un carpintero (Agent).*

## 14. RETO 48 HORAS (ACTO 7 - RETURN)
*Tu misión final:*

### 📥 HOY
Descarga y lee los manuales generados.

### 🛠️ MAÑANA
Crea los 3 agentes en ChatGPT (usando los manuales).

### ⚔️ PASADO MAÑANA
Coordina `@Guardian` + `@General` (o tu equivalente de Marca/Ventas) en 1 tarea real.

---
> "Mientras tú duermes, tu competencia ya está desplegando su ejército.
> **¿Sigues manual o automatizas el trabajo?**
> La diferencia entre crecer o quedarte atrás se decide hoy."

## 15. LA SIGUIENTE FRONTERA: PHYSICAL AI (IA FÍSICA)
*Más allá del Chat:*
Cuando la Inteligencia Agéntica ("Cerebro") se conecta a un cuerpo o actuador en el mundo real.

* **Concepto:** `Embodied AI` (IA Encarnada).
* **Aplicación en TESO:**
    1.  **Drones:** Inspección automática de vehículos.
    2.  **IoT:** El coche reporta su propio estado de aceite/frenos al `Agente de Mantenimiento`.
    3.  **Robótica:** Brazos robóticos para carga/descarga automática.

> *Hoy dominas los bits (Digital Agents). Mañana dominarás los átomos (Physical AI).*

## 11. LOS 3 AGENTES ESENCIALES (EL TRIUNVIRATO)
*El equipo mínimo viable:*

### 🎖️ AGENTE 1: Capitán de Marca (Estratega)
*   **Rol:** Conoce TODO sobre tu empresa (Misión, Tono, Valores). Valida que nada salga "fuera de marca".
*   **Input:** Contexto Estratégico.

### 🎯 AGENTE 2: Soldado de Ventas (Analista)
*   **Rol:** Experto en cualificación. Lee leads, detecta oportunidades y asigna "Temperatura" (Cold/Warm/Hot).
*   **Action:** Scoring de Leads.

### ✉️ AGENTE 3: Soldado de Email MKT (Ejecutor)
*   **Rol:** Copywriter persuasivo. Escribe secuencias de conversión basadas en la temperatura del lead.
*   **Output:** Borradores de campañas.

## 12. CONSTRUYE TU EQUIPO (ACTO 5 - BUILD)
*Proceso Interactivo en Clase:*
1.  **Datos Básicos:** Nombre Negocio + Sector.
2.  **Selección de Agentes:** Recomendado activar los 3 para máxima coordinación.
3.  **Preguntas de Personalización:** La IA (Learning Heroes) te hace 2 preguntas por agente para afinar el prompt.

**Status:** *Generando equipo...* (Esperando Manuales PDF/Texto).
