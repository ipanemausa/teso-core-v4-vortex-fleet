@echo off
title INICIANDO SISTEMA TESO v4.0...
color 0A
cls

echo ==================================================
echo   🚀 INICIANDO CENTRO DE COMANDO TESO v4.0
echo ==================================================
echo.
echo 1. LIMPIANDO PROCESOS ANTIGUOS...
taskkill /F /IM node.exe >nul 2>&1
echo    [OK] Sistema limpio.
echo.

echo 2. INICIANDO SERVIDOR DE DESARROLLO...
cd /d "%~dp0.."
call npm install >nul 2>&1
start /B npm run dev
echo    [OK] Servidor iniciado en segundo plano.
echo.

echo 3. ESPERANDO CARGA DEL SISTEMA (5s)...
timeout /t 5 >nul

echo 4. LANZANDO INTERFAZ GRAFICA...
start http://localhost:5173

echo.
echo ==================================================
echo   ✅ TODO LISTO. PUEDES MINIMIZAR ESTA VENTANA.
echo      NO LA CIERRES HASTA TERMINAR LA DEMO.
echo ==================================================
echo.
pause
