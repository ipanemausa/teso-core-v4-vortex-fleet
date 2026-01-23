# TESO: Diccionario de Eventos & KPIs

**Propósito:** Estandarizar la implementación de analítica en el código (Frontend & Backend).
**Formato de Naming:** `OBJECT_ACTION_CONTEXT` (Snake Case, Uppercase).

---

## 1. Funnel de Adquisición & Onboarding

| Event Name | Trigger (Cuándo se dispara) | Propiedades Obligatorias (Payload) |
| :--- | :--- | :--- |
| `APP_OPEN` | Al iniciar la app o volver de background | `source` (organic, deep_link, push), `user_id` (if auth) |
| `SIGNUP_START` | Usuario hace tap en "Registrarse" | `method` (email, sso_google, sso_microsoft) |
| `SIGNUP_COMPLETE` | Usuario completa registro exitosamente | `user_type` (personal, corporate_admin, passenger) |
| `ONBOARDING_CORP_SKIP` | Usuario salta la configuración corporativa | `step` (billing_info, email_validation) |
| `ONBOARDING_CORP_SUCCESS` | Usuario valida email corporativo | `domain` (e.g. "@google.com"), `company_name` |

---

## 2. Funnel de Solicitud (Ride Request)

| Event Name | Trigger | Payload |
| :--- | :--- | :--- |
| `RIDE_QUOTE_VIEW` | Usuario ve pantalla de estimación de precio | `pickup_zone`, `dropoff_zone`, `est_price`, `est_time` |
| `RIDE_REQUEST_SUBMIT` | Usuario confirma solicitud ("Pedir") | `service_type` (sedan, suv, van), `is_scheduled` (true/false) |
| `RIDE_REQUEST_ERROR` | Fallo técnico al pedir | `error_code`, `error_message` |
| `RIDE_MATCH_START` | Sistema empieza a buscar chofer | `request_id` |
| `RIDE_MATCH_SUCCESS` | Chofer asignado | `driver_id`, `wait_time_seconds` |
| `RIDE_CANCEL_USER` | Usuario cancela antes de finalizar | `cancel_reason`, `time_since_request` |

---

## 3. Ejecución del Servicio (Live Ops)

| Event Name | Trigger | Payload |
| :--- | :--- | :--- |
| `DRIVER_ARRIVED` | Chofer marca "En punto de recolección" | `gps_lat`, `gps_lon`, `distance_to_pickup` |
| `TRIP_START` | Pasajero a bordo, inicio de viaje | `start_time` |
| `TRIP_COMPLETE` | Viaje finalizado | `duration_minutes`, `distance_km`, `final_price` |
| `RIDE_RATED` | Usuario califica servicio | `stars` (1-5), `tags` (cleanliness, punctuality, politeness) |

---

## 4. Métricas de Negocio (Backend)

| Event Name | Definición |
| :--- | :--- |
| `REVENUE_RECOGNIZED` | Cobro exitoso procesado. |
| `CHURN_RISK_DETECTED` | Usuario corporativo >30 días inactivo. |
| `NPS_SCORE_SUBMIT` | Respuesta a encuesta de satisfacción global. |

---

## Reglas de Implementación

1.  **No PII en Analytics:** NUNCA enviar nombres reales, emails o teléfonos en las propiedades de eventos. Usar IDs ofuscados (UUIDs).
2.  **Consistencia:** Respetar mayúsculas y guiones bajos. `Trip_Start` != `TRIP_START`.
3.  **Offline Queuing:** Si no hay internet, el evento se guarda y se envía al reconectar.
