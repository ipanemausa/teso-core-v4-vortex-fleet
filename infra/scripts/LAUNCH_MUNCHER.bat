@echo off
title INICIANDO MUNCHER OS...
color 0D
cls
echo ==================================================
echo   🍔 INICIANDO MUNCHER KITCHEN OS
echo ==================================================
echo.
echo 1. Verificando entorno...
cd /d "%~dp0.."
echo.
echo 2. Iniciando Servidor...
start /B npm run dev
echo.
echo 3. Abriendo Dashboard Financiero...
timeout /t 4 >nul
start http://localhost:5173/?mode=muncher
echo.
echo ==================================================
echo   ✅ MUNCHER ACTIVO. NO CIERRES ESTA VENTANA.
echo ==================================================
pause
