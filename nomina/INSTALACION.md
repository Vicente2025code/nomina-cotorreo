# Guía de instalación — PC de Lili

Esta guía es para **quien instale el programa por primera vez** (Vicente, IT, o un asistente técnico). Lili NO debe seguir esta guía — ella usa MANUAL-LILI.md después de que esté instalado.

## Tiempo total: ~15 minutos

---

## Paso 1: Instalar Python (5 min)

1. Ir a **https://www.python.org/downloads/**
2. Descargar la última versión de Python para Windows (Python 3.12 o superior)
3. Ejecutar el instalador
4. **CRÍTICO:** marcar la casilla **"Add Python to PATH"** antes de darle "Install Now"
5. Esperar a que termine. Reiniciar la PC si lo pide.

**Verificación:** abrir PowerShell o CMD y escribir:
```
python --version
```
Debe mostrar algo como `Python 3.12.x`. Si dice "no se reconoce", revisar paso 4.

---

## Paso 2: Copiar la carpeta del programa (2 min)

1. Copiar la carpeta completa `nomina-cotorreo` de la PC de Vicente a la PC de Lili
2. Recomendación de ubicación: `C:\Users\lili\Documents\nomina-cotorreo\` o similar
3. La carpeta debe contener estos archivos:
   - `app.py`
   - `parser.py`
   - `parser_pdf.py`
   - `inject.py`
   - `mapping.json`
   - `Lanzar Nomina.bat`
   - `MANUAL-LILI.md`
   - carpeta `inputs/` (puede estar vacía)
   - carpeta `outputs/` (puede estar vacía)

---

## Paso 3: Instalar las librerías (3 min)

Abrir PowerShell **en la carpeta del programa**:
1. Abrir el Explorador de Windows
2. Navegar a la carpeta `nomina-cotorreo`
3. Click en la barra de direcciones, escribir `powershell` y Enter
4. En la ventana negra que aparece, escribir:

```
pip install streamlit pandas openpyxl xlrd pdfplumber
```

Esperar 1-3 minutos a que descargue todo. Al final debe decir "Successfully installed".

---

## Paso 4: Crear acceso directo en el escritorio (2 min)

1. Abrir la carpeta `nomina-cotorreo`
2. Click derecho sobre **"Lanzar Nomina.bat"**
3. Click en **"Enviar a"** → **"Escritorio (crear acceso directo)"**
4. Ir al escritorio. Aparece un ícono nuevo.
5. Renombrarlo a algo claro como **"Nómina Cotorreo"**
6. Opcional: click derecho → Propiedades → Cambiar icono (poner uno de Excel o similar)

---

## Paso 5: Probar la primera vez (3 min)

1. Doble click al ícono **"Nómina Cotorreo"** del escritorio
2. Debe abrirse:
   - Una ventana negra (mantenerla abierta)
   - Después de 5 segundos, el navegador con la página del Procesador
3. Probar subir los 3 archivos de prueba (los que están en `inputs/` de la PC de Vicente):
   - `17_StandardReport.xls`
   - `report.pdf`
   - `NOMINA I MAYO 2026.xlsx`
4. Apretar "Procesar nómina"
5. Verificar que descarga un Excel llamado `... - PRELLENADO.xlsx`
6. Abrir el Excel y verificar que las hojas tienen horarios escritos

Si todo funciona: **listo, entregar a Lili junto con MANUAL-LILI.md**.

---

## Paso 6: Entregar a Lili

1. Imprimir o mandar por correo el archivo **MANUAL-LILI.md** (o pasarlo a PDF antes)
2. Mostrarle:
   - Dónde está el ícono del escritorio
   - Cómo se ve la página cuando abre
   - Cómo descarga el archivo final
3. Acompañarla en la primera quincena para resolver dudas

---

## Mantenimiento

### Cuando hay actualizaciones del programa
Vicente edita el código en su PC, prueba, y copia los archivos `.py` actualizados a la carpeta de Lili. Las librerías no necesitan reinstalarse.

### Cuando hay un colaborador nuevo
1. Lili crea la hoja individual en su Excel quincenal (como siempre)
2. Vicente actualiza `mapping.json` con el mapeo nombre-reloj → hoja
3. Listo

### Si Lili dice "ya no funciona"
1. Verificar que la ventana negra esté abierta cuando intenta usar
2. Verificar que la URL en el navegador sea `localhost:8501`
3. Si no, cerrar todo y volver a doble-click al ícono
4. Si persiste, reinstalar librerías:
   ```
   pip install --upgrade streamlit pandas openpyxl xlrd pdfplumber
   ```

---

## Backup recomendado

La carpeta `nomina-cotorreo` (excluyendo `inputs/` y `outputs/`) debe estar respaldada. Es muy chica (<1 MB). Opciones:
- Copiar a OneDrive de la empresa
- Repo privado en GitHub
- Carpeta compartida en Drive

Si Lili rota o cambia PC, la carpeta se copia + Python se instala = funcionando en 15 min.
