# Arquitectura de Flujo Total: Ecosistema TESO v4

Este diagrama detalla el flujo de datos y decisiones desde que un usuario (Cliente/Conductor) interactúa con la plataforma hasta la ejecución del servicio.

```mermaid
graph TD
    %% --- ACTORES ---
    User((Cliente VIP))
    Driver((Conductor Pro))
    Admin((Centro Ops))

    %% --- ENTRY POINT ---
    subgraph "Capas de Acceso (App.jsx / Landing)"
        Splash[Landing Page 'Neural Core']
        Splash -->|Selección Rol| Select{¿Tipo de Usuario?}
        
        Select -->|Soy Conductor| DriverReg[Registro Conductor]
        Select -->|Soy Pasajero| UserReg[Registro Usuario]
        Select -->|Credenciales Admin| AdminLogin[Login Operativo]
    end

    %% --- ONBOARDING FLOW ---
    subgraph "Proceso de Validación (Onboarding)"
        DriverReg -->|Envía Docs| AutoCheck{Validación Auto}
        AutoCheck -->|Fallo| Rejected[Rechazo Automático]
        AutoCheck -->|Docs OK| ManualReview[Revisión Humana (Seguridad)]
        ManualReview -->|Aprobado| DriverActive[Estado: ACTIVO / DISPONIBLE]
        
        UserReg -->|Tarjeta/Código Corp| PaymentCheck{Validación Pago}
        PaymentCheck -->|Fallido| UserBlock[Solicitar otro medio]
        PaymentCheck -->|OK| UserActive[Dashboard Cliente]
    end

    %% --- ORDER CYCLE ---
    subgraph "Ciclo de Servicio (The Engine)"
        UserActive -->|Solicita Viaje| OrderType{¿Tipo?}
        
        %% ON DEMAND LOGIC
        OrderType -->|Inmediato| Radar(Algoritmo RADAR)
        DriverActive -->|Se conecta| Radar
        Radar -->|Geo-Cerca + Ranking| Match[Oferta a Mejor Conductor]
        Match -->|Acepta| OnTrip[Viaje en Curso]
        Match -->|Rechaza| NextDriver[Siguiente en Ranking]
        
        %% SCHEDULED / VIP LOGIC
        OrderType -->|Programado / VIP| Scheduler(Agenda Central)
        Scheduler -->|Bloqueo Calendario| DriverFuture[Reserva Slot Conductor]
        DriverFuture -->|1h Antes| CheckIn{Confirmación}
        CheckIn -->|No responde| Rescue[Alerta Rescate Flota]
        CheckIn -->|Listo| OnTrip
    end

    %% --- MONITORING ---
    subgraph "Control Operativo (Admin Dashboard)"
        OnTrip -->|Telemetría GPS| LiveMap[Mapa Operativo]
        LiveMap -->|Alerta Desvío| SecurityAlert[ALERTA SEGURIDAD]
        OnTrip -->|Finaliza| Billing[Facturación Automática]
        Billing -->|Corp| Invoice[Factura Mensual]
        Billing -->|Pago Digital| Stripe[Cobro Tarjeta]
    end

    %% --- RELATIONS ---
    Admin -->|Supervisa| LiveMap
    Admin -->|Aprueba| ManualReview
    SecurityAlert -->|Llamada| Admin
```

## Leyenda Operativa

1.  **Validación Dual**: A diferencia de Uber (que automatiza todo), Teso mantiene un paso de "Revisión Humana" para conductores, garantizando el estándar VIP.
2.  **Motor Híbrido**: El sistema maneja dos colas distintas:
    *   **FAST LOOP**: Para viajes inmediatos (milisegundos).
    *   **SLOW LOOP**: Para agenda corporativa (garantía de cumplimiento).
3.  **Seguridad Activa**: El centro de control no solo despacha, sino que recibe alertas de desviaciones en tiempo real (`SharedRideView`).
