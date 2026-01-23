# DAILY STARTUP PROTOCOL (PROTOCOLO DE ARRANQUE DIARIO)

**OBJETIVO**: Iniciar el día de trabajo sin romper nada.
**REGLA DE ORO**: "Asume que Localhost es efímero. La verdad está en la Nube."

## 1. PREPARACIÓN (THE COFFEE PHASE)
1.  **Sync Git**: Siempre baja lo último antes de tocar nada.
    ```powershell
    git pull origin main
    ```
2.  **Clean State**: Si ayer hubo caos, limpia el área de trabajo.
    ```powershell
    # Windows
    ./LIMPIEZA_TOTAL.bat
    ```

## 2. ARRANQUE DEL SISTEMA (THE LAUNCH)
No uses comandos sueltos (`npm start`, `python main.py`). Usa los lanzadores oficiales ubicados en `scripts/`.

### Para Backend (Core)
```powershell
./START_TESO_BLINDADO.bat
```
*Este script verifica Docker, levanta la DB y el API.*

### Para Frontend (War Room)
```powershell
./INICIAR_DEMO_RODEO.bat
```
*Este script conecta el UI con el API local o remoto según configuración.*

## 3. CHEQUEO DE SALUD (HEALTH CHECK)
Antes de escribir código, verifica que el paciente respire.
1.  Visita: `http://localhost:8000/health` (Debe decir "OPERATIONAL").
2.  Revisa la consola del API: Busca "✅ SEEDING COMPLETE".

## 4. PROTOCOLO DE CIERRE (SHUTDOWN)
1.  **Commit Diario**: Nunca dejes código sin guardar.
    ```powershell
    ./GUARDAR_TODO_A_LA_NUBE.bat
    ```
2.  **Apagar Motores**: Cierra terminales para liberar puertos.

---
*Created by Antigravity*
