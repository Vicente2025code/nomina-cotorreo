# Procesador de Nómina — Grupo Cotorreo

Sistema que toma los reportes de los dos relojes checadores y prellena las hojas individuales del Excel de nómina. Lili sólo revisa las celdas resaltadas y firma.

## Para qué sirve

Antes Lili interpretaba a mano ~220 días-persona por quincena (entradas y salidas AM/PM para 17 personas × 15 días). Ahora el sistema lo hace automático y solo deja para revisión humana los días con datos ambiguos (~9 de 255, **3.5%**).

**Validado contra la planilla de Lili (I Mayo 2026):** 88.9% match exacto. El 11% restante son decisiones humanas legítimas (redondeos de horarios, días libres no marcados, ausencias justificadas).

## Cómo usarlo cada quincena

1. **Exportar del reloj #1** (Standard Report en XLS) → guardar en `inputs/` como `17_StandardReport.xls`
2. **Exportar del reloj #2** (Original Records en PDF) → guardar en `inputs/` como `report.pdf`
3. **Poner la planilla nueva de Lili** en `inputs/` (ej. `NOMINA II MAYO 2026.xlsx`)
4. **Editar `inject.py`** y cambiar la línea `INPUT_NOMINA` para apuntar al archivo nuevo
5. **Doble-click a `correr-nomina.bat`**
6. Abrir `outputs/...PRELLENADO.xlsx` y revisar las celdas resaltadas en **amarillo** (revisión) o **naranja** (incompleto)
7. Cuando esté validado, mandar a Mariela como siempre

## Estructura

```
nomina-cotorreo/
├── parser.py            Parser del reloj #1 (Standard Report XLS)
├── parser_pdf.py        Parser del reloj #2 (Original Records PDF)
├── inject.py            Inyector: combina ambos y escribe en hojas individuales
├── mapping.json         Mapeo persona-del-reloj → hoja-del-Excel
├── correr-nomina.bat    Atajo de un click para correr todo
├── inputs/              Archivos originales (NUNCA se modifican)
└── outputs/             Archivos generados
    ├── horarios_parseados.xlsx       Tabla limpia del reloj #1
    ├── horarios_pdf.xlsx             Tabla limpia del reloj #2
    ├── revision_manual.xlsx          Solo casos a revisar (SR)
    ├── revision_manual_pdf.xlsx      Solo casos a revisar (PDF)
    └── NOMINA ... - PRELLENADO.xlsx  Excel de Lili ya prellenado
```

## Códigos de color en el output

- **Amarillo**: el algoritmo asignó pero hay ambigüedad. Revisar.
- **Naranja**: marca incompleta (1 fichaje suelto). Decidir si trabajó.
- **Sin color**: el algoritmo está seguro, no requiere atención.

## Algoritmo (resumen)

Para cada día-persona, el parser:

1. Toma todos los fichajes (timestamps) del reloj
2. Filtra fichajes `00:00` (errores del dispositivo)
3. Deduplica timestamps muy cercanos (< 2 min)
4. Ordena cronológicamente
5. Aplica heurísticas según número de fichajes:
   - **4 fichajes** → ENT-AM / SAL-AM / ENT-PM / SAL-PM (caso normal)
   - **3 fichajes** → infiere cuál falta según gap del almuerzo (< 90 min)
   - **2 fichajes con gap grande** → jornada continua (ENT-AM / SAL-PM)
   - **1 o 0 fichajes** → marca INCOMPLETO o LIBRE_O_AUSENCIA

## Pendientes / próximos pasos

- **Crear hoja para Pablo Hidalgo** si va a marcar (hoy aparece en NÓMINA sin hoja individual)
- **Validar caso Chelsy en ambos relojes** (3 días en PDF, 11 en SR) — decidir si sumar o quedarse con SR
- **Fase 3 (futuro):** migrar a Airtable + n8n cuando Lili esté cómoda con el flujo actual
- **Configurar Teralog #2 para Standard Report** (eliminar dependencia del PDF crudo)

## Stack técnico

- Python 3.12
- Librerías: `pandas`, `openpyxl`, `xlrd`, `pdfplumber`
- Sin servicios externos. Todo corre local.
