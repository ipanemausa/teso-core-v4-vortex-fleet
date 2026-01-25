# TESO MASTER ASSUMPTIONS (V4 REDUCED)

## 1. Principios Generales
- El motor de simulación (`simulation_engine.py` + `generate_dataset.py`) es la ÚNICA fuente de verdad.
- Este documento rige toda la lógica de negocio.

## 2. Supuestos Maestros (Escenario V4 Reducido)

### 2.1. Liquidez y Caja
\[
Saldo\_Inicial = (Costo\_Operativo\_Diario \times 30) + Gastos\_Fijos\_Mensuales
\]
Objetivo: Cubrir el "Valle de la Muerte" (Brecha de 23 días).

### 2.2. Unit Economics (Por Servicio)
**Tarifa Base:** $125.000 COP
- Comisión Teso (20%): $25.000
- Peaje (Passthrough): $18.000
- Pago Conductor: $82.000
- **Identidad:** $25k + $18k + $82k = $125k

### 2.3. Timing
- **CxC Clientes:** T+30 días
- **CxP Conductores:** T+7 días

### 2.4. Operación y Volumen
- **Servicios Diarios Base:** 40
- **Flota:** 15 Vehículos (Ratio ~2.6 servicios/vehículo - Eficiencia Alta)
- **Mix:** 90% Corporativo / 10% On-Demand

### 2.5. Horizonte
- **Duración:** 360 Días

## 3. Parámetros de Configuración (Código)
```python
CONFIG = {
    "DAILY_SERVICES": 40,
    "TOTAL_DRIVERS": 45, # Adjusted for 40 services
    "TOTAL_CLIENTS": 100, # Reduced from 500 for V4 scale
    "GROWTH_FACTOR": 1.0,
    "CORPORATE_RATIO": 0.9,
    "CHAOS_PROBABILITY": 0.10,
    "HORIZON_DAYS": 360,
    "FARE": 125000,
    "DRIVER_PAY": 82000,
    "TOLL": 18000
}
```
