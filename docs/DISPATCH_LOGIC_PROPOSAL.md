# Protocolo de Asignación y Despacho Inteligente (TESO v4)

Este documento detalla la lógica de negocio adoptada tras el análisis de competencias (Uber, Cabify Corp) para la gestión híbrida de flotas en Teso.

## 1. Clasificación de Órdenes

El sistema distingue dos tipos fundamentales de solicitudes, cada una con su propia máquina de estados:

### A. Órdenes On-Demand (Inmediatas)
*   **Origen**: Usuario final (App Pasajero) o Solicitud Rápida Corporativa.
*   **Prioridad**: Velocidad de recogida.
*   **SLA Objetivo**: < 5 minutos.

### B. Órdenes Programadas / VIP
*   **Origen**: Gestor de Viajes, Reservas Corporativas, Rutas Fijas.
*   **Prioridad**: Confiabilidad y Calidad del Vehículo.
*   **SLA Objetivo**: Asignación confirmada 12h antes del servicio.

---

## 2. Algoritmo de Despacho (The "Matchmaker")

### Lógica para On-Demand (Modo "Radar")
El sistema ejecuta un ciclo de ráfagas (Broadcast & Filter):

1.  **Geocercado Dinámico**: 
    *   Radio inicial: 2 km.
    *   Si no hay respuesta en 15s -> Expande a 5 km.
2.  **Scoring de Candidatos**:
    Cada conductor disponible recibe un puntaje ($S$):
    $$S = (D \times -1) + (R \times 10) + (V \times 5)$$
    *   $D$: Distancia en minutos.
    *   $R$: Rating del conductor (1-5).
    *   $V$: Ajuste por tipo de vehículo (VIP = +5).
3.  **Oferta Secuencial**:
    *   La orden se ofrece al conductor con mayor $S$.
    *   Tiene 15 segundos para aceptar.
    *   Si rechaza o expira, pasa al siguiente.

### Lógica para Programadas / VIP (Modo "Agenda")
1.  **Ventana de Pre-Asignación**:
    *   Las órdenes entran al "Pool de Futuros" inmediatamente.
    *   El sistema busca conductores "Preferidos" o "VIP" que tengan disponibilidad en esa franja futura.
2.  **Bloqueo de Calendario**:
    *   Al aceptar, la franja horaria del conductor se bloquea (ej. 2:00 PM - 4:00 PM).
    *   El sistema **no** le enviará órdenes On-Demand que solapen con este compromiso (Logic "Safety Buffer" de 45 mins antes).
3.  **Reconfirmación**:
    *   60 minutos antes del servicio, el sistema solicita "Check-in" al conductor.
    *   Si falla, se dispara una "Alerta de Rescate" a la flota cercana.

---

## 3. Capas de Seguridad y Verificación (Onboarding)

Tal como se implementó en la nueva interfaz de registro (`src/components/onboarding`), se requieren los siguientes estados:

1.  **Aspirante (Applicant)**: Registro inicial.
    *   *Docs*: Cédula, Licencia, Tarjeta de Propiedad.
2.  **En Validación (Under Review)**:
    *   Verificación automática de antecedentes (Simulado/API Terceros).
    *   Inspección visual del vehículo (Fotos/Cita presencial).
3.  **Activo (Active)**:
    *   Puede recibir despachos.
4.  **Suspendido/Bloqueado**:
    *   Por documentos vencidos o bajo rating (< 4.2).

## 4. Diferencias Clave con la Competencia

| Característica | Uber/Indriver | Teso Corporate (Propuesta) |
| :--- | :--- | :--- |
| **Filtro Vehículo** | Básico (Año) | **Estricto (Marca/Línea + Inspección)** |
| **Conductor** | Gig Economy | **Profesional Verificado (Seguridad Social)** |
| **Asignación** | Algoritmo Caja Negra | **Preferencia a "Conductor de Confianza" del Cliente** |
| **Pago** | Tarjeta Personal | **Centro de Costos / Facturación Mensual** |

---

## Próximos Pasos de Implementación

1.  **Backend**: Implementar `DispatchEngine` (Python/Celery) para procesar las colas.
2.  **Driver App**: Crear vista de "Oferta Entrante" con cuenta regresiva.
3.  **Admin Panel**: Visibilidad de órdenes "Huérfanas" (sin asignar) en tiempo real.
