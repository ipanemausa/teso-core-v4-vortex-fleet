@echo off
title INICIANDO TESO OPS v4.0...
color 0B
cls
echo ==================================================
echo   ✈️ INICIANDO TESO GLOBAL OPERATIONS
echo ==================================================
echo.
echo 1. Verificando entorno...
cd /d "%~dp0.."
echo.
echo 2. Iniciando Servidor...
start /B npm run dev
echo.
echo 3. Abriendo Panel de Control...
timeout /t 4 >nul
start http://localhost:5173
echo.
echo ==================================================
echo   ✅ TESO ACTIVO. NO CIERRES ESTA VENTANA.
echo ==================================================
pause
