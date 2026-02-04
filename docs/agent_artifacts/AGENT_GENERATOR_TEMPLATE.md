# ARTEFACTO GENERADOR DE EQUIPOS (META-TEMPLATE)

> **Uso:** Copia este prompt en cualquier LLM (ChatGPT, Claude) para generar un equipo de agentes personalizado para CUALQUIER negocio.

---

## 1. EL PROMPT MAESTRO (COPIAR Y PEGAR)

```markdown
Actúa como un Arquitecto de Sistemas Multi-Agente experto.
Quiero construir un equipo de 3 agentes coordinados para mi negocio.

### PASO 1: DATOS DEL NEGOCIO
*   **Nombre:** [INSERTAR NOMBRE]
*   **Sector:** [INSERTAR SECTOR]
*   **Objetivo:** [INSERTAR OBJETIVO PRINCIPAL]

### PASO 2: DEFINICIÓN DE ROLES (EL TRIUNVIRATO)
Necesito que generes los "System Instructions" (Manuales) para estos 3 roles adaptados a mi negocio:

1.  **🎖️ EL CAPITÁN DE MARCA (Estratega):**
    *   Debe asegurar que todo output suene como mi marca.
    *   Define el tono de voz y las reglas no negociables.

2.  **🎯 EL SOLDADO DE ANÁLISIS (Analista):**
    *   Debe ser capaz de leer un input (email, lead, dato) y clasificarlo.
    *   Define criterios de éxito (Hot/Warm/Cold).

3.  **✉️ EL SOLDADO DE EJECUCIÓN (Operador):**
    *   Debe generar el entregable final (Respuesta, Código, Reporte).
    *   Usa frameworks de conversión probados.

### PASO 3: INSTRUCCIONES DE SALIDA
Para cada agente, entrégame un bloque de código Markdown con:
*   **Role Definition:** Quién es.
*   **Context:** Qué sabe del negocio.
*   **Mission:** Qué debe lograr.
*   **Constraints:** Qué NO hacer nunca.
*   **Interaction Protocol:** Cómo habla con los otros dos agentes.
```

---

## 2. EJEMPLO DE USO (CASO TESO)

*   **Nombre:** TESO
*   **Sector:** Logística Tech
*   **Objetivo:** Automatizar despacho de vehículos.

*(Al pegar esto en ChatGPT, el modelo generará los manuales específicos que ya guardamos en `docs/agent_manuals/`)*.
