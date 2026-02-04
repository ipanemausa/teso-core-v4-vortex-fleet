# TESO CORE: AUTONOMOUS AGENT ORCHESTRATION PROTOCOL
> **System Architecture:** Event-Driven Multi-Agent System (MAS)
> **Paradigm:** Distributed Choreography vs. Centralized Orchestration
> **Revision:** 2.0 (PhD Candidate Standard)

---

## 1. THEORETICAL FRAMEWORK (ABSTRACT)

The TESO logistical operation is modeled not as a linear pipeline, but as a **Complex Adaptive System (CAS)** composed of autonomous, specialized agents. Unlike traditional imperative programming (`if-then-else`), this architecture relies on **Semantic Event Processing**.

### Core Axioms:
1.  **Decentralized Intelligence:** No single agent possesses the full state of the system. Knowledge is distributed.
2.  **Event-Driven Reactivity:** Agents remain dormant (stateless) until a specific **Trigger Event** activates their Context Window.
3.  **Deterministic Determinism:** Despite using Probabilistic LLMs (GPT-4), the **Flow of Control** must be deterministic to ensure financial and operational safety.

---

## 2. SYSTEM TOPOLOGY (THE TRIUMVIRATE)

The architecture implements a **Hierarchical Decision Network**:

*   **Layer 1: The Strategist (`@GuardianTESO`)**
    *   *Ontological Role:* Normative Supervisor.
    *   *Function:* Enforces invariant constraints (Brand Safety, Legal Compliance) upon the outputs of lower-tier agents.
    
*   **Layer 2: The Analyst (`@AnalystTESO`)**
    *   *Ontological Role:* State Interpreter.
    *   *Function:* Transmutes unstructured data (Natural Language, GPS Coordinates) into structured payloads (JSON Objects, Risk Scores).

*   **Layer 3: The Executor (`@ActionTESO`)**
    *   *Ontological Role:* Side-Effect Generator.
    *   *Function:* Interacts with external interfaces (WhatsApp API, SMTP, ElevenLabs). It is "blind" to strategy but "precise" in execution.

---

## 3. CHOREOGRAPHIES (STATE TRANSITIONS)

### MOVEMENT I: ACQUISITION & QUALIFICATION (INITIATION)
*State:* `IDLE` -> `SIGNAL_DETECTED`

1.  **TRIGGER:** `CLIENT_SIGNAL (Vector: Omnichannel)`
    *   *Processor:* **The Analyst** utilizing Zero-Shot Classification.
    *   *Logic:* Feature Extraction (Intent, Entity Recognition).
    *   *Output Event:* `INTENT_CLASSIFIED { type: "NEW_ORDER", confidence: 0.98 }`

2.  **TRIGGER:** `ORDER_DRAFTED`.
    *   **🎺 Entrada:** `@GuardianTESO` (Capitán de Marca).
    *   **Acción:** Valida si la ruta es segura y si el cliente no está en "Lista Negra" (Deuda).
    *   **Salida (Evento):** `ORDER_VALIDATED` (o `ORDER_REJECTED`).

---

## 🎼 SEGUNDO MOVIMIENTO: EL DESPACHO (PRESTO)
*Contexto: Asignar el mejor recurso.*

3.  **TRIGGER:** `ORDER_VALIDATED`.
    *   **🥁 Entrada:** `@DispatchCore` (Algoritmo Matematico Puro + Agente).
    *   **Acción:** Busca conductores en radio de 5km. Calcula tiempos.
    *   **Autonomía:** Asigna automáticamente si la confiabilidad es >90%. Si es complicado, alerta a humano.
    *   **Salida (Evento):** `DRIVER_ASSIGNED`.

4.  **TRIGGER:** `DRIVER_ASSIGNED`.
    *   **🎻 Entrada:** `@ActionTESO` (Ejecutor).
    *   **Acción:** Envía la confirmación al Cliente ("Tu móvil TSO-404 va en camino") y al Conductor.
    *   **Nota:** Usa el tono "Cyberpunk Operativo" definido en el Manual.

---

## 🎼 TERCER MOVIMIENTO: EL VIAJE (ANDANTE)
*Contexto: Monitoreo en tiempo real.*

5.  **TRIGGER:** `TRIP_STARTED` (GPS detecta movimiento).
    *   **👁️ Entrada:** `@GuardianTESO` (Supervisor Pasivo).
    *   **Acción:** Monitorea desvíos de ruta > 10%.
    *   **Intervención:** Si hay desvío, dispara alerta silenciosa. Si hay parada no programada > 5min, llama al conductor (Voz AI).

---

## 🎼 CUARTO MOVIMIENTO: EL CIERRE (FINALE)
*Contexto: Cobro y Feedback.*

6.  **TRIGGER:** `TRIP_COMPLETED`.
    *   **📠 Entrada:** `@AnalystTESO` (Finance Mode).
    *   **Acción:** Calcula costo final (Tiempo + Distancia + Peajes detectados). Genera Factura.
    *   **Salida (Evento):** `INVOICE_READY`.

7.  **TRIGGER:** `INVOICE_READY`.
    *   **🎻 Entrada:** `@ActionTESO`.
    *   **Acción:** Cita la tarjeta del cliente o envía Link de Pago. Envía encuesta de satisfacción.
    *   **Coda:** Registra la transacción en el Dataset V4 para futuro entrenamiento.

## 4. THE HAND-OFF PROTOCOL (DATA CONTINUITY)
*How to pass the baton without dropping it.*

Every transition (Trigger) must carry a standardized **Context Payload**:

```json
{
  "service_id": "TSO-998877",
  "client_profile": {
    "id": "USR-123",
    "tier": "VIP_GOLD",
    "sentiment": "URGENT"
  },
  "state_history": [
    { "agent": "@Analyst", "action": "INTENT_CLASSIFIED", "timestamp": 17099988 }
  ],
  "next_required_action": "VALIDATE_ROUTE"
}
```
*Rule:* No agent speaks to another without passing this JSON. This ensures the receiving agent has full memory of the transaction.

---

## DE LA PARTITURA A LA REALIDAD
Para implementar esto, solo necesitamos codificar los **"Event Listeners"** en nuestro backend o frontend:


```javascript
EventBus.on('TRIP_COMPLETED', async (tripData) => {
    const invoice = await AnalystAgent.calculate(tripData); // El Analista entra
    if (invoice.isValid) {
        await ActionAgent.sendEmail(invoice); // El Ejecutor entra
    }
});
```
*Sin humanos interviniendo en el flujo normal. Solo en excepciones.*

## 5. RELEVANCE ENGINE (RAG FRAMEWORK)
*Knowledge is Power.*

Agents must not rely solely on training data. They must query the **TESO Knowledge Base** (`docs/knowledge_base/`):
*   **Pricing Policy:** Accessed by `@Analyst` to determine surge pricing.
*   **Crisis Manual:** Accessed by `@Guardian` if a car sends an SOS signal.
*   **Legal Docs:** Accessed by `@Action` before sending contracts.

**Implementation:**
The Orchestrator injects relevant snippets into the Agent's context window dynamically.
`context = prompt + get_relevant_kb("pricing_rules")`
