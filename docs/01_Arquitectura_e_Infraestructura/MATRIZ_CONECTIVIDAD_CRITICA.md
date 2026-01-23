# MATRIZ DE CONECTIVIDAD CRÍTICA (TESO)
## Mapa de Integraciones Externas

Este documento lista todas las conexiones que la App TESO necesita para operar legal y funcionalmente.
Clasificación: **CRÍTICO** (Detiene la operación) vs **DESEABLE** (Mejora la experiencia).

---

### 1. GOBIERNO & LEGALIDAD (Compliance)
| Entidad | Propósito | Estado Actual | Criticidad | Notas |
| :--- | :--- | :--- | :--- | :--- |
| **RUNT / SIMIT** | Validar Licencias y Multas de Choferes | 🔴 Pendiente | ALTA | Necesario para evitar responsabilidad civil. |
| **Registraduría** | Validar identidad real (Cédula) | 🔴 Pendiente | MEDIA | Evita suplantación de identidad. |
| **DIAN** | Facturación Electrónica Automática | 🟡 Simulado | **CRÍTICA** | Obligatorio para clientes corporativos (Argos, SURA). |

### 2. FINANCIERO (Dinero)
| Entidad | Propósito | Estado Actual | Criticidad | Notas |
| :--- | :--- | :--- | :--- | :--- |
| **Pasarela (Wompi/PayU)** | Cobro Tarjetas Crédito | 🔴 Pendiente | **CRÍTICA** | Sin esto no cobramos. |
| **Bancos (Bancolombia)** | Dispersión de Pagos (Nómina Choferes) | 🔴 Pendiente | ALTA | Pago automático a la flota. |

### 3. OPERATIVO (El Viaje)
| Entidad | Propósito | Estado Actual | Criticidad | Notas |
| :--- | :--- | :--- | :--- | :--- |
| **Google Maps / Mapbox** | Mapas, Tráfico y Rutas | 🟢 Simulado | **CRÍTICA** | El corazón de la app. |
| **Twilio / WhatsApp API** | Notificaciones SMS y Chat | 🔴 Pendiente | MEDIA | Comunicación conductor-pasajero. |
| **FlightAware / AeroAPI** | Datos de Vuelos en Tiempo Real | 🟡 Simulado | MEDIA | Clave para recogidas en Aeropuerto JMC. |

---

### TAREAS PARA PRÁCTICA:
1. Investigar costos de API de Google Maps vs Mapbox.
2. Definir qué proveedor usaremos para SMS (AWS SNS vs Twilio).
3. Investigar requisitos para facturar con la DIAN vía software propio.
