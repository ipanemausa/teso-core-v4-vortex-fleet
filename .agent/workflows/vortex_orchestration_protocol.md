---
description: Vortex Agent Orchestration Protocol
---

# Vortex Agent Orchestration Protocol (VAOP)

This document defines the architecture for the Multi-Agent System (MAS) within TESO Core V4.

## 1. Core Philosophy
The system operates as a **Federated Agent Network** where specialized agents perform discrete tasks within a unified pipeline. The "Vortex Orchestrator" manages the state and flow of data between these agents.

## 2. Agent Workforce (The Pipeline)

The operational pipeline consists of 5 specialized nodes (Agents) that execute sequentially for each order.

| Sequence | Agent ID | Name | Role | Input | Output |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **MARKET** | Market Sensor | Demand Listening & Ingestion | Raw Signal | Validated Order Request |
| 2 | **PRICING** | Pricing Core | Dynamic Algo & Route Calculation | Order Request | Priced Quotation (Fare) |
| 3 | **FINANCE** | Payment Guardian | Funds Reservation & Fraud Check | Quotation | Payment Token / Approval |
| 4 | **COMPLIANCE** | Legal Check | Regulatory Validation (RNT/SOAT) | Vehicle + Driver | Clearance Certificate |
| 5 | **DISPATCH** | Ops Sentinel | Assignment & Routing | Clearance + Order | Active Mission (Trip) |

## 3. Orchestration Logic

The **Vortex Orchestrator** is the central state machine.

### State Machine Definition
For any given Order (process), the state transitions are:
`IDLE` -> `MARKET_SCAN` -> `CALCULATING_PRICE` -> `SECURING_FUNDS` -> `VALIDATING_LEGAL` -> `DISPATCHING` -> `COMPLETED`

### Failure Modes
- If **FINANCE** fails -> Order Rejected (Payment Declined).
- If **COMPLIANCE** fails -> Driver Re-assignment.

## 4. Implementation Strategy

### Frontend Controller (`src/services/VortexOrchestrator.js`)
A JavaScript class that manages the Simulation Loop.
- **Tick Rate**: 1000ms (1Hz)
- **Concurrency**: 1 Active Pipeline (Single Thread Demo) or Multi-Threaded.
- **Event Bus**: Emits events (`NODE_START`, `NODE_COMPLETE`, `PIPELINE_ERROR`) that the UI listens to.

### Backend Connectivity
- **Level 1 (Simulation)**: Logic runs client-side for visual fluidity.
- **Level 2 (Hybrid)**: "Consulting" actions (Strategy) hit the Python Backend (`/api/agently/gemini`).
- **Level 3 (Full)**: Pipeline steps call discrete endpoints. (Future Scope).

## 5. UI Visualization
The `OperationalDashboard` serves as the "God View" for this orchestration, rendering the status of each Agent Node in real-time.

---
**Status**: ACTIVE
**Version**: 4.1
