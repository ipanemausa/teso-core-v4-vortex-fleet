@echo off
echo ========================================================
echo      GENERADOR DE COPIAS DE SEGURIDAD (SIN NUBE)
echo ========================================================
echo.
echo Creando blindaje local para TESO OPS...
echo.

:: Obtener fecha y hora para el nombre del archivo
set year=%date:~6,4%
set month=%date:~3,2%
set day=%date:~0,2%
set hour=%time:~0,2%
if "%hour:~0,1%" == " " set hour=0%hour:~1,1%
set min=%time:~3,2%
set sec=%time:~6,2%

set BACKUP_NAME=Respaldo_Teso_%year%-%month%-%day%_%hour%-%min%

:: Crear carpeta de Respaldos si no existe
if not exist "C:\Users\ipane\OneDrive\Escritorio\RESPALDOS_TESO" (
    mkdir "C:\Users\ipane\OneDrive\Escritorio\RESPALDOS_TESO"
)

:: Copiar archivos (excluyendo node_modules para velocidad)
echo Copiando archivos a C:\Users\ipane\OneDrive\Escritorio\RESPALDOS_TESO\%BACKUP_NAME%...
xcopy "%~dp0.." "C:\Users\ipane\OneDrive\Escritorio\RESPALDOS_TESO\%BACKUP_NAME%" /E /I /H /Y /exclude:%~dp0excludes.txt

echo.
echo ========================================================
echo      ¡COPIA EXITOSA! SU PROYECTO ESTA SEGURO.
echo      Ubicacion: Escritorio > RESPALDOS_TESO
echo ========================================================
pause
