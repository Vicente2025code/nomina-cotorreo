@echo off
REM Procesador de nomina Grupo Cotorreo - quincenal
REM Uso: doble click. Asegurate de tener los archivos en inputs/

cd /d "%~dp0"
echo ====================================================
echo  PROCESADOR DE NOMINA - GRUPO COTORREO
echo ====================================================
echo.
echo Paso 1/3: Parseando reloj #1 (Standard Report XLS)...
python parser.py
if errorlevel 1 goto error
echo.
echo Paso 2/3: Parseando reloj #2 (PDF Original Records)...
python parser_pdf.py
if errorlevel 1 goto error
echo.
echo Paso 3/3: Inyectando horarios en el Excel de Lili...
python inject.py
if errorlevel 1 goto error
echo.
echo ====================================================
echo  LISTO. Abre el archivo:
echo  outputs\NOMINA I MAYO 2026 - PRELLENADO.xlsx
echo  Revisa SOLO las celdas en amarillo/naranja.
echo ====================================================
echo.
pause
exit /b 0

:error
echo.
echo *** HUBO UN ERROR. Revisa el mensaje arriba. ***
pause
exit /b 1
