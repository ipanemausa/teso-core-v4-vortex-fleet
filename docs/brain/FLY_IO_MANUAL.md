# FLY.IO STRATEGY: 0 COST MONITORING

**OBJECTIVE**: Monitor the "War Room" availability 24/7 without paying server costs.

## 1. THE "SCALE TO ZERO" STRATEGY
We use Fly.io's **Auto-Stop** feature.
*   **Idle**: When no one is using the app (e.g., 2 AM), the machine shuts down. **Cost: $0**.
*   **Wake Up**: When you open the URL, it boots up in ~3 seconds.
*   **Allowance**: Fly gives ~$5/mo free credit, enough for 3 small VMs running casually.

## 2. HOW TO CHECK STATUS (WITHOUT COST)
Do NOT keep the dashboard open 24/7 (that burns hours).

### Method A: The Health Ping (Fastest)
Bookmark this URL:
`https://teso-api-prod.fly.dev/health`
*   **Response**: `{"status": "operational"}`
*   **Cost**: negligible execution time.

### Method B: The Command Line
Run this from any terminal (authenticated):
```powershell
fly status -a teso-api-prod
```
*   Shows if it is `started` or `suspended` (sleeping).

## 3. RULES OF ENGAGEMENT
1.  **Don't Stress Test Production**: Run heavy simulations (`days=3600`) on Localhost. Use Prod for viewing data.
2.  **Logs**: Check logs via dashboard only when debugging.
3.  **Deploy**: Only deploy "Green State" code (Main Branch).

---
*Created by Antigravity*
