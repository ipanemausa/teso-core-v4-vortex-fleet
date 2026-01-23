# TESO MASTER ASSUMPTIONS (SUPUESTOS Y REGLAS MAESTRAS)

**UBICACIÓN**: `teso_core/docs/TESO_MASTER_ASSUMPTIONS.md`
**ESTADO**: ACTIVO (FUENTE DE VERDAD)
**ULTIMA ACTUALIZACIÓN**: 2025-12-29

Este documento consolida TODOS los supuestos matemáticos, financieros y operativos que rigen la simulación de Teso. El código (`simulation_engine.py`) debe obedecer estrictamente estas reglas.

---

## 1. REGLAS FINANCIERAS (EL CORAZÓN)

### 1.1. Garantía de Liquidez Inicial (Regla de Cobertura)
*   **Saldo Inicial en Caja**: NO es un monto fijo. Es **DINÁMICO**.
*   **Fórmula**: `(Costo Operativo Diario * 30 Días) + Gastos Fijos Mensuales`.
*   **Objetivo**: Garantizar matemáticamente la operación durante el primer mes ("Valle de la Muerte") mientras empiezan a entrar los pagos de clientes (Cartera).
*   **Implementación Actual**: ~$800.000.000 COP (Aprox).

### 1.2. Estructura de Ingresos (Unit Economics)
Por cada servicio estándar simulado ($125.000 COP):
1.  **Ingreso Bruto (GTV)**: $125.000 COP.
2.  **Comisión Teso (Revenue)**: 20% ($25.000 COP). **Se registra como entrada independiente en Caja.**
3.  **Costo Peaje**: $18.000 COP (Passthrough).
4.  **Pago al Conductor**: $82.000 COP (Remanente).

### 1.3. Ciclos de Flujo de Caja (Cash Flow Timing)
*   **Cobro a Clientes (CxC Inflow)**: T + 30 Días (Promedio).
*   **Pago a Conductores (CxP Outflow)**: T + 7 Días (Semanal).
*   **Brecha de Liquidez**: 23 Días (Día 7 al Día 30) donde sale dinero pero no entra. **Esto es lo que cubre el Saldo Inicial.**

---

## 2. SUPUESTOS OPERATIVOS (LA FLOTA)

### 2.1. Capacidad Instalada
*   **Flota Activa**: 350 Vehículos (Vans/SUVs).
*   **Base de Clientes**: 500 Empresas Corporativas.

### 2.2. Volumen de Operación
*   **Servicios Diarios**: 240 Servicios (Promedio Base).
*   **Factor de Crecimiento**: Ajustable en "War Room" (Default 1.0x).
*   **Total Anual Estimado**: ~86,400 Servicios.

### 2.3. Mix de Servicios (Liquidez)
*   **Corporativo (90%)**: Pago a Crédito (30 Días).
*   **On-Demand (10%)**: Pago Inmediato (T + 0). "Tipo Uber/Cabify".
    *   *Impacto*: Alivia el flujo de caja diario desde el Día 1.

---

## 3. PARÁMETROS DE SIMULACIÓN (EL TIEMPO)

### 3.1. Horizonte de Tiempo
*   **Duración Estándar**: **360 Días**.
*   **Razón**: Permitir análisis de estacionalidad y sostenibilidad financiera anual.

### 3.2. Persistencia
*   La simulación **NO SE BORRA** al cerrar el navegador.
*   Se almacena en Caché de Servidor (Python Memory) y Caché Local (Browser).
*   Solo se regenera bajo orden explícita ("Regenerar") o cambio de parámetros críticos.

---

## 4. ESCENARIOS DE ESTRÉS (WAR ROOM)

El sistema debe ser capaz de simular fallos probabilísticos:
*   **Probabilidad de Caos**: 60% de los servicios diarios (Modo WAR ROOM Activado).
*   **Tipos de Fallo**:
    *   *No Show* (Conductor no llega).
    *   *Varada Mecánica* (Operativo).
    *   *Cartera Vencida* (Financiero - Retraso en pagos de clientes).

---

**NOTA PARA DESARROLLADORES:**
Si vas a modificar `simulation_engine.py`, PRIMERO actualiza este documento. Si el código contradice este documento, el código es un BUG.
