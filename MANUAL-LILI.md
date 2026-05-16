# Manual de Nómina — Lili

## Lo que vas a hacer cada quincena

```
   1                  2                3                4
 ┌─────┐         ┌─────────┐      ┌─────────┐      ┌─────────┐
 │ USB │    →    │  Abrir  │   →  │ Subir 3 │   →  │Descargar│
 │reloj│         │ Nómina  │      │archivos │      │ Excel   │
 └─────┘         └─────────┘      └─────────┘      └─────────┘
   5 min          10 segundos       30 segundos      Listo
```

---

## PASO 1 — Descarga del reloj (lo que ya haces)

**Reloj #1 (Plaza Cotorreo):**
1. Mete tu USB al reloj y exporta el **Standard Report** como siempre
2. Guarda el archivo `.xls` en una carpeta cualquiera (ej. Descargas)

**Reloj #2 (otra ubicación):**
1. Mete tu USB y exporta el **Original Records** como siempre
2. Guarda el archivo `.pdf` en la misma carpeta

**Tu planilla:**
1. Abre la carpeta donde tienes tu Excel de nómina nueva (la quincena que vas a procesar)
2. Tenla a la mano

---

## PASO 2 — Abre el programa

Doble click al ícono **"Lanzar Nomina"** en tu escritorio.

Espera 5 segundos. Se va a abrir tu navegador (Chrome o Edge) en una página que dice:
**"Procesador de Nómina — Grupo Cotorreo"**

**IMPORTANTE:** No cierres la ventana negra que se abrió. Esa es el "motor". Solo trabaja en el navegador.

---

## PASO 3 — Sube los 3 archivos

En la página verás 3 cuadros. Arrastra cada archivo a su cuadro correspondiente:

| Cuadro | Qué arrastras |
|---|---|
| **Reloj #1** | El archivo `.xls` del Standard Report |
| **Reloj #2** | El archivo `.pdf` del Original Records |
| **Tu planilla** | El archivo `.xlsx` de la nómina nueva |

O si prefieres, **click en cada cuadro** y selecciónalos desde tu computadora. Cualquiera de las dos funciona.

---

## PASO 4 — Aprieta el botón morado

Cuando los 3 archivos estén subidos, aparece un botón grande morado que dice **"Procesar nómina"**.

Click ahí.

Vas a ver una barra que avanza:
- "Leyendo fichajes del reloj #1..."
- "Leyendo fichajes del reloj #2..."
- "Escribiendo horarios en tu planilla..."

Tarda entre **10 y 30 segundos**.

---

## PASO 5 — Descarga el resultado

Cuando termine verás:

```
✓ Listo. Tu planilla está prellenada.

  255           9          17
DÍAS PROCESADOS  PARA REVISAR  COLABORADORES
```

Click al botón **"Descargar"**. Se descarga un archivo que se llama igual que tu planilla pero con "**- PRELLENADO**" al final.

---

## PASO 6 — Revisa solo lo amarillo y naranja

Abre el archivo que descargaste. Verás todas las hojas de los colaboradores ya con los horarios escritos.

Hay celdas pintadas de colores que debes revisar:

| Color | Qué significa | Qué haces |
|---|---|---|
| 🟡 **Amarillo** | El sistema no estuvo seguro (faltó un fichaje, hora rara) | Lo revisas con tu criterio, corrige si es necesario |
| 🟠 **Naranja** | Marca incompleta (la persona solo marcó 1 vez ese día) | Decides si trabajó, completas o lo dejas |
| Sin color | El sistema está seguro | NO necesitas tocar nada |

**Por quincena suelen ser 8-10 celdas a revisar.** El resto ya está listo.

---

## PASO 7 — Cierra todo

Cuando termines de trabajar el Excel:
1. Guarda tu Excel donde siempre lo guardas
2. Mándalo a Mariela como siempre
3. **Cierra el navegador** (la pestaña de Procesador de Nómina)
4. **Cierra la ventana negra** que sigue abierta (la del "motor")

---

## Si algo sale mal

**"No se abre el navegador automáticamente"**
→ Abre Chrome o Edge a mano y escribe en la barra: `localhost:8501`

**"Dice error rojo en la página"**
→ Toma captura de pantalla del mensaje completo y mándale a Vicente

**"El Excel descargado tiene horarios raros en una hoja"**
→ Esa hoja específica puede necesitar ajuste manual. Avísale a Vicente cuál hoja.

**"No me aparece un colaborador en el Excel"**
→ Si está en NÓMINA pero no aparece, dile a Vicente — puede que falte mapearlo.

---

## Qué NO hace este programa

- ❌ NO calcula salarios, deducciones ni CCSS. Eso lo siguen calculando tus fórmulas del Excel.
- ❌ NO modifica tu Excel original (siempre te descarga una COPIA llamada "PRELLENADO").
- ❌ NO envía datos a internet. Todo corre en tu computadora.

---

## Ahorro de tiempo esperado

| Antes | Ahora |
|---|---|
| 2 horas leyendo fichajes | 30 segundos del programa |
| Capturar 250 pares de horarios | Revisar 9 casos dudosos |
| Errores humanos posibles | Cálculo consistente |
