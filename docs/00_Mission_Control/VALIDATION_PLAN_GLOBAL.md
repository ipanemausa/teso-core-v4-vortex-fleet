# Plan de Validación Global & Pruebas de Concepto (PoC)

**Objetivo:** Pasar del "PowerPoint" a la "Realidad". Verificar si la estrategia "World-Class" es viable técnica y comercialmente para TESO.

---

## 1. Pruebas de Mercado (Phantom Testing)
*Validar la demanda antes de escribir código complejo.*

### A/B Test de Propuesta de Valor
*   **Prueba:** Lanzar 2 variantes de la Landing Page con tráfico mínimo (Ads/Orgánico).
    *   **Variante A (Funcional):** "Transporte al Aeropuerto. Seguro y Puntual."
    *   **Variante B (Aspiracional/Global):** "Tu Chofer Privado. Estándar Business Class."
*   **KPI:** Conversion Rate a "Cotizar". Si B gana, confirmamos que el usuario busca status/servicio, no solo transporte.

### "Smoke Test" de Flight Tracking
*   **Prueba:** Poner el campo "Número de Vuelo" en el formulario web actual.
*   **Validación:** ¿Cuántos usuarios lo llenan? Si el 80% lo deja vacío, quizás no sea prioritario para *nuestro* usuario inicial.

---

## 2. Pruebas Operativas (Concierge MVP)
*Simular tecnología con humanos para garantizar calidad.*

### Simulación de "Dispatch Global"
*   **Prueba:** Durante 1 semana, tú (o un operador) actúan como el "Algoritmo de Gestión de Vuelos".
*   **Acción:** Usar FlightRadar24 manual. Si un vuelo se retrasa, avisar manualmente al chofer y al cliente.
*   **Objetivo:** Entender la complejidad operativa real antes de automatizar la integración con APIs de vuelos (que son costosas).

### Test de "Quiet Mode" (Modo Silencio)
*   **Prueba:** Instruir a 5 choferes de confianza para que, al ver una nota específica en la orden ("SILENCIO"), no hablen excepto salud/despedida.
*   **Validación:** Medir la reacción del cliente y la propina.

---

## 3. Pruebas Técnicas (Technical Spikes)
*Validar si nuestra arquitectura actual soporta la ambición.*

### Spike 1: UI de "Preferencias de Viaje"
*   **Acción:** Implementar rápidamente en el Frontend (`RideRequestForm`) los selectores de:
    *   Temperatura (Frío/Neutro/Cálido)
    *   Conversación (Normal/Silencio)
    *   Equipaje (Ayuda requerida/No)
*   **Objetivo:** Ver si sobrecarga la interfaz visual o si se siente "Premium".

### Spike 2: Simulación de Tarifas B2B (Fijas)
*   **Acción:** Crear un JSON estático con tarifas fijas Aeropuerto <-> Zonas Corporativas.
*   **Objetivo:** Probar si el sistema de "Cotización" actual puede ignorar la distancia/tiempo y usar tarifas planas por zona (Zone-based pricing).

---

## 4. Financial Stress Test (Simulación Financiera)
*¿Dan los números con este nivel de servicio?*

*   **Escenario:** Si ofrecemos "1h de espera gratis" en aeropuerto...
    *   ¿Cuánto nos cuesta pagarle esa hora al chofer?
    *   ¿El precio "Premium" cubre ese costo muerto?
*   **Herramienta:** Usar tu simulador actual (`simulationEngine.js`) ajustando los parámetros de costos para ver si el margen se mantiene positivo.

---

**Recomendación Inmediata:**
Empecemos con el **Spike 1 (UI de Preferencias)**. Es rápido, visible y hace tangible la estrategia de "Servicio a Medida" inmediatamente en la app.
