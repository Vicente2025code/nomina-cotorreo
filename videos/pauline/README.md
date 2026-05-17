# Video para Pauline — 10 meses en Ciudad Quesada

Video vertical (1080×1920) hecho con Remotion. Combo musical: Coldplay
*Adventure of a Lifetime* → *Everglow*. Duración total: **4:30**.

## Estructura del video

| Sección | Frames | Tiempo | Componente |
|---|---|---|---|
| Apertura | 0 – 450 | 0:00 – 0:15 | `Opening.tsx` |
| Primeros días | 450 – 1350 | 0:15 – 0:45 | `FirstDays.tsx` |
| Timeline de meses | 1350 – 4050 | 0:45 – 2:15 | `MonthsTimeline.tsx` |
| Aventuras (clips) | 4050 – 4950 | 2:15 – 2:45 | `Adventures.tsx` |
| Stats Spotify-style | 4950 – 5400 | 2:45 – 3:00 | `Stats.tsx` |
| Mensajes de familia | 5400 – 6900 | 3:00 – 3:50 | `FamilyMessages.tsx` |
| Cierre bilingüe | 6900 – 8100 | 3:50 – 4:30 | `Closing.tsx` |

Adventure of a Lifetime suena de 0:08 a 3:00. Everglow entra en 3:00 con
fade-in suave y termina con fade-out en 4:30.

## Setup (en tu PC)

```bash
cd videos/pauline
npm install
```

Si tu Node es viejo, actualizalo a 20+.

## Qué tenés que poner antes de previsualizar

### 1. Audio (en `public/audio/`)

- `adventure-of-a-lifetime.mp3`
- `everglow.mp3`

**Aviso copyright:** Coldplay es música protegida. Para regalárselo a Pauline
en USB / WhatsApp privado, *fair use* aplica en la mayoría de jurisdicciones.
Si vas a subirlo a Instagram/YouTube público, lo van a mutear o bloquear
automáticamente. Para una versión pública, usar covers licenciables de
Epidemic Sound, Artlist o similar — y reemplazar los archivos.

### 2. Fotos (en `public/photos/`)

Nombres esperados según `src/data/meses.json`:

- `opening.jpg` — primera foto de Pauline llegando (aeropuerto, primer día)
- `closing.jpg` — la última, idealmente algo simbólico (mejor si tiene
  movimiento, abrazo, mesa familiar)
- `primeros-dias-01.jpg` … `primeros-dias-06.jpg` — 6 fotos de las primeras
  3 semanas
- `mes-01-a.jpg`, `mes-01-b.jpg`, `mes-01-c.jpg` — 3 fotos por mes × 10 meses
- `mensaje-mama.jpg`, `mensaje-papa.jpg`, `mensaje-hermano.jpg`,
  `mensaje-todos.jpg` — fotos para los 4 mensajes de familia

Si te sobran fotos (tenés 200+) podés aumentar las que muestra cada mes
editando los arrays en `meses.json` y subirá el `perPhoto` automáticamente.

### 3. Clips de video (en `public/videos/`)

6 clips para la sección "Aventuras", nombres en `Adventures.tsx`:

- `adventure-01.mp4` — Volcán Arenal
- `adventure-02.mp4` — Playa del Coco
- `adventure-03.mp4` — Monteverde
- `adventure-04.mp4` — La Fortuna
- `adventure-05.mp4` — Manuel Antonio
- `adventure-06.mp4` — el cierre de aventuras

Cualquier formato MP4/MOV/WebM con codec H.264 funciona. Si tus clips son
horizontales, Remotion los va a recortar al frame vertical — elegí clips
con la acción centrada. Si querés podemos ajustar para que se vean
letterboxed con fondo blureado (avisame).

### 4. Editar los textos

Abrí estos archivos y reemplazá los placeholders por la verdad de tu año:

- `src/data/meses.json` — captions e hitos de cada mes
- `src/data/stats.json` — números reales (días, km, ciudades, etc.)
- `src/data/mensajes.json` — textos de cada miembro de la familia
- `src/components/Closing.tsx` — chequeá la traducción al alemán con un
  hablante nativo. La que tengo es funcional pero te recomiendo
  validarla con Pauline mentalmente (¿le sonaría natural?) o con un amigo
  que hable alemán.

## Comandos

```bash
# Preview interactivo (recomendado mientras editás)
npm start
# Abre http://localhost:3000 con timeline scrubeable

# Render final vertical 9:16
npm run build

# Render alta calidad (más lento, mejor para el archivo "para Pauline")
npm run build:hq

# Render cuadrado 1:1 para post de Instagram
npm run build:square
```

Outputs van a `out/`.

## Iteración recomendada

1. Pon 1 foto en cada slot (placeholder) y corré `npm start`. Vas a ver el
   layout completo aunque las fotos no sean las definitivas.
2. Ajustá los tiempos (`TIMINGS` en `src/theme.ts`) si una sección se
   siente larga o corta.
3. Cuando esté el tempo, llená con las fotos buenas y los textos finales.
4. Render final con `npm run build:hq`.

## Para dejarle a Pauline

- El MP4 vertical en una memoria USB o por WhatsApp (compresión va a
  golpear la calidad — preferí USB o Google Drive con link).
- Si querés, también el código fuente del proyecto en un Drive — es un
  regalo doble: el video + un trozo de lo que hicieron juntos en código.

## Notas técnicas

- `OffthreadVideo` evita los bugs de sync de `<Video>` al renderizar.
- Las fuentes (Inter + Playfair Display) se cargan via `@remotion/google-fonts`
  para que no parpadeen en el render.
- Photos usan un truco de "fondo blureado con el mismo asset" para que las
  fotos horizontales no se vean cortadas en 9:16.
- Si una sección te queda fuera de tiempo, el resto del video NO se rompe
  — solo se corre. Tocá `TIMINGS` y los `from` se recalculan solos.
