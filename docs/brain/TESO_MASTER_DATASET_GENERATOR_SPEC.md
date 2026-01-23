# TESO MASTER DATASET GENERATOR SPECIFICATION

**STATUS**: DRAFT (Recreated from `Teso_Restored_Ledger.xlsx`)
**VERSION**: 1.0.0
**SOURCE OF TRUTH**: `teso_core/docs/TESO_MASTER_ASSUMPTIONS.md`

---

## 1. PURPOSE
This document defines the mathematical and structural rules required to generate or validate the `TESO_MASTER_DATASET.xlsx`. Any dataset used in simulation MUST comply with these rules.

## 2. DATASET STRUCTURE (SCHEMA)
The dataset represents the "PROGRAMACION" (Service Schedule) sheet.

| Column | Type | Description | Values / Format |
| :--- | :--- | :--- | :--- |
| **ID** | `String` | Unique Service ID | HEX (e.g., `516024F8`) |
| **FECHA** | `Date` | Service Date | `YYYY-MM-DD` or `MM/DD/YYYY` |
| **HORA** | `String` | Service Time | `HH:MM` or `NOW` |
| **CLIENTE** | `String` | Corporate Client Name | Mapping `[EMPRESAS]` list |
| **VEHICULO** | `String` | Assigned Vehicle | `SUV`, `VAN`, `SEDAN` |
| **TARIFA** | `Float` | Service Cost | Default: `$125,000` |
| **TIPO** | `String` | Service Type | `CORPORATIVO`, `ON_DEMAND` |
| **NOTAS** | `String` | Operational Notes | Free text |
| **ESTADO** | `String` | Lifecycle Status | `PROGRAMADO`, `EN_CURSO`, `FINALIZADO`, `CANCELADO` |

## 3. GENERATION RULES (THE RECIPE)

### 3.1. Volume & Time
*   **Total Rows**: ~86,400 (360 Days * 240 Services/Day).
*   **Distribution**: Uniformly distributed across 360 days.
*   **Seasonality**: (Optional) Weekend drop-off factor 0.8x.

### 3.2. Client Distribution (Pareto Principle)
Based on `Teso_Restored_Ledger` sampling:
*   **Top Tier (40% Vol)**: `Bancolombia`, `Ecopetrol`, `Argos`.
*   **Mid Tier (40% Vol)**: `Sura`, `Nutresa`, `ISA`.
*   **Long Tail (20% Vol)**: ~60 small SMEs.

### 3.3. Financials
*   **Tarifa Standard**: $125,000 COP.
*   **Toll (Peaje)**: $18,000 COP (Passthrough).
*   **Commission**: 20% (Calculated derived).

### 3.4. Chaos (War Room)
*   **Chaos Rate**: 10% of rows must represent issues.
*   **Implementation**:
    *   5% `CANCELADO` (No Revenue).
    *   3% `RETRASADO` (Service Recovery Cost).
    *   2% `NO_SHOW` (Passenger fault -> Penalty Fee).

## 4. VALIDATION CHECKS
A valid dataset must pass:
1.  `count(ID) == unique(ID)`
2.  `sum(TARIFA) ~= 86,400 * 125,000`
3.  `min(FECHA)` = Day 1, `max(FECHA)` = Day 360.
