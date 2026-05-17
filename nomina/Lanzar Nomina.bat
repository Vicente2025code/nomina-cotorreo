@echo off
REM Lanzador de la aplicacion de nomina.
REM Doble click aqui para iniciar. Se abre solo el navegador.

cd /d "%~dp0"
title Nomina Cotorreo - mantener esta ventana abierta

echo ============================================================
echo  PROCESADOR DE NOMINA COTORREO
echo  Iniciando aplicacion...
echo ============================================================
echo.
echo  Espera 5 segundos. Tu navegador se abrira automaticamente.
echo  CUANDO TERMINES: cierra el navegador y cierra esta ventana.
echo.
echo ============================================================

streamlit run app.py --server.headless false --browser.gatherUsageStats false
