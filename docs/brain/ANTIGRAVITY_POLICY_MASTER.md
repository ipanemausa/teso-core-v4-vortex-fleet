# ANTIGRAVITY POLICY MASTER

**STATUS**: ACTIVE
**VERSION**: 1.0.0
**AUTHOR**: Antigravity (Governance Module)

---

## 1. FUNDAMENTAL AXIOMS (THE GOLDEN RULES)
1.  **LOCALHOST IS DEAD**: All architecture must be designed for Cloud Native execution (Fly.io, Vercel). Local execution is only for development preview.
2.  **NO DATA LOSS**: The Simulation State (`TESO_MASTER_DATASET`) must strictly adhere to the `TESO_MASTER_ASSUMPTIONS` persistence rules.
3.  **MONOREPO INTEGRITY**: `teso_core` and `studio` must remain decoupled in code but united in version control.

## 2. SECURITY PROTOCOLS (DEFCON LEVELS)

### DEFCON 5 (Normal Ops)
*   **Deployment**: Automated via GitHub Actions.
*   **Access**: RBAC Standard.

### DEFCON 1 (War Room / Crisis)
*   Triggered by: `insolvency_risk > 80%` or Security Breach.
*   **Action**:
    1.  Lockdown all write access to `TESO_MASTER_DATASET`.
    2.  Activate "War Room" UI on all active clients.
    3.  Engage `simulation_engine.py` in STRESS MODE.

## 3. DEPLOYMENT STANDARDS
*   **Backend**: Fly.io (`fly.toml` required).
*   **Frontend**: Vercel/Netlify (`vercel.json` or build script required).
*   **Database**: PostgreSQL (Production) / SQLite (Dev Ephemeral).

## 4. INCIDENT RESPONSE
In case of "Code Hallucination" or "Architecture Drift":
1.  Reference `TESO_MASTER_ASSUMPTIONS.md`.
2.  If code deviates from Assumptions, **CODE IS BUG**.
3.  Rollback to last known "Green State" in `ANTIGRAVITY_STATE_REPORT`.
