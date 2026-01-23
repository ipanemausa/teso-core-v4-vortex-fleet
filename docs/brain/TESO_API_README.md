# TESO CORE API DOCUMENTATION

**VERSION**: 1.0.0
**SERVER**: FastAPI (Python 3.10)
**BASE URL**: `http://localhost:8000` (Dev) / `https://teso-api-prod.fly.dev` (Prod)

---

## 1. ENDPOINTS

### 1.1. Simulation Data
**GET** `/api/simulation/data`

Returns the generated financial and operational data for the dashboard.

*   **Parameters**:
    *   `days` (int, optional): Horizon to simulate. Default: 360.
    *   `growth` (float, optional): Traffic multiplier. Default: 1.0.
    *   `cxc_days` (int, optional): Days to collect payment. Default: 30.
    
*   **Response (JSON)**:
    ```json
    {
      "summary": { "total_services": 86400, "source": "POSTGRES_DB" },
      "services": [ ... ],
      "cash_flow": [ ... ],
      "banks": [ ... ]
    }
    ```

### 1.2. Health Check
**GET** `/health`

Returns server status.

---

## 2. INTEGRATION CONTRACT
*   **Auth**: Currently OPEN (No Bearer Token required for Demoware).
*   **CORS**: Enabled for `*` in Dev, Restricted in Prod.

## 3. DEVELOPER NOTES
*   The API uses `simulation_engine.py` to generate or fetch data.
*   If DB is empty, it attempts to seed from `TESO_EDGE_DOCUMENT_VIVO.xlsx`.
