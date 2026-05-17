# Deploy a página web pública — Streamlit Cloud

Esta guía es para **publicar la app en internet** con autenticación por contraseña. Después tendrás una URL tipo `nomina-cotorreo.streamlit.app` que Lili (o quien tenga la clave) puede abrir desde cualquier PC.

## ⚠️ Antes de empezar — lee esto

Esta versión web hace que los archivos de nómina pasen brevemente por **servidores de Streamlit (en EE.UU.)**. Aunque se borran al cerrar la sesión:

- **Datos personales viajan a otro país** (Ley 8968 CR sobre protección de datos)
- **Si Streamlit es hackeado**, tus datos podrían quedar expuestos
- **Validar con tu contador/abogado** antes de operar así

Si después de leer esto **prefieres NO publicar**, no hay problema — la versión local (C2) que ya tienes es totalmente funcional y privada.

## Tiempo total: ~15 minutos

---

## Requisitos previos

- Cuenta de **GitHub** (https://github.com — gratis)
- Cuenta de **Streamlit Cloud** (https://share.streamlit.io — gratis, login con GitHub)

---

## Paso 1: Subir el código a GitHub (5 min)

1. Ir a https://github.com y crear **un repositorio nuevo PRIVADO** (no público)
   - Nombre sugerido: `nomina-cotorreo`
   - Visibility: **Private** (CRÍTICO)
   - NO inicializar con README ni .gitignore (ya los tenemos)

2. Abrir PowerShell en la carpeta `nomina-cotorreo`:
   ```
   cd "C:\Users\vicente benitez2\nomina-cotorreo"
   git init
   git add app.py parser.py parser_pdf.py inject.py mapping.json requirements.txt .gitignore
   git add MANUAL-LILI.md INSTALACION.md README.md DEPLOY-WEB.md
   git commit -m "Initial commit - nomina cotorreo"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/nomina-cotorreo.git
   git push -u origin main
   ```

   Reemplazar `TU_USUARIO` con tu usuario de GitHub.

3. **Verificar en GitHub** que la carpeta `inputs/` y `outputs/` aparezcan **VACÍAS** (solo el .gitkeep). Si ves archivos de nómina reales ahí, los .gitignore están mal y hay que borrarlos.

---

## Paso 2: Conectar Streamlit Cloud (3 min)

1. Ir a https://share.streamlit.io
2. Login con GitHub
3. Click "Create app" → "Deploy a public app from GitHub"
4. Seleccionar:
   - Repository: `TU_USUARIO/nomina-cotorreo`
   - Branch: `main`
   - Main file path: `app.py`
5. **NO darle deploy todavía** — primero configurar la contraseña

---

## Paso 3: Configurar la contraseña (2 min)

1. En Streamlit Cloud, antes del deploy, click en **"Advanced settings"**
2. En la sección **"Secrets"** pegar lo siguiente (sustituir la clave por la tuya):

   ```toml
   password = "ELIGE_UNA_CONTRASEÑA_LARGA_Y_SEGURA"
   ```

   **Recomendaciones para la contraseña:**
   - Mínimo 16 caracteres
   - Mezcla mayúsculas, minúsculas, números y símbolos
   - Ejemplo aleatorio: `Kx7m#vP2qL9rN4wT`
   - Guárdala en tu gestor de contraseñas (1Password, LastPass, Bitwarden)
   - NO uses la misma de otros servicios

3. Click **"Save"**

---

## Paso 4: Deploy (3 min)

1. Click **"Deploy"** y esperar 2-3 minutos
2. Cuando termine, tendrás una URL pública: `https://nomina-cotorreo-TUUSUARIO.streamlit.app`
3. Abrir esa URL desde cualquier dispositivo
4. Debe mostrarse la pantalla de login (no la app directamente)
5. Introducir la contraseña configurada → entras a la app

---

## Paso 5: Compartir con quien va a usarla (1 min)

Mandar a Lili (o quien la use):
- La URL: `https://nomina-cotorreo-TUUSUARIO.streamlit.app`
- La contraseña, por canal **seguro** (NO email plano — usar WhatsApp/Signal/llamada)

---

## Buenas prácticas operativas

### Cambiar la contraseña periódicamente
- Cada 3 meses idealmente
- O inmediatamente si alguien con acceso se va
- Para cambiarla: Streamlit Cloud → tu app → Settings → Secrets → editar → Save

### Si sospechas de una filtración
1. Cambia la contraseña INMEDIATAMENTE (Streamlit Cloud → Secrets)
2. Revisa logs de la app (Streamlit Cloud muestra accesos)
3. En caso grave: borra la app entera (Streamlit Cloud → Settings → Delete app)

### Updates del código
- Cambios en el código local → `git push` → Streamlit Cloud redespliega automático (~2 min)
- No necesitas tocar la contraseña ni reconfigurar nada

---

## Limitaciones de la versión web

- **Recursos limitados**: el tier gratuito de Streamlit Cloud tiene CPU/RAM acotados. Si la planilla crece mucho (>50 personas) puede ser lento.
- **Sin persistencia**: cada vez que cierras la pestaña, se borra todo lo cargado. NO hay historial.
- **Tiempo de inactividad**: si nadie la usa por días, Streamlit la apaga. La primera petición tras dormirse tarda 30-60 seg en despertar.
- **Mapping.json en el repo**: si agregas un colaborador nuevo, hay que actualizarlo en código (no hay UI para editarlo).

---

## Comparativa rápida: cuándo usar cuál

| Caso | Usa esta versión |
|---|---|
| Lili procesa nómina en su PC habitual | **Local (C2)** — más rápido, privacidad total |
| Lili está fuera de la oficina | **Web (C1)** — desde cualquier PC con la URL+clave |
| Mariela o Katy quieren ver el resumen | **Web (C1)** — solo darles URL+clave |
| Demostrar a un asesor/contador | **Web (C1)** — sin instalar nada en su lado |
| Backup si la PC de Lili se daña | **Web (C1)** — funciona aunque su PC esté apagada |

Recomendación: **ten ambas instalaciones**. Local como default diario, web como respaldo y para flexibilidad.

---

## Si quieres mayor seguridad después

Cuando esto se vuelva crítico para el negocio, considera migrar a:
- **VPS propio** ($5/mes, datos NO salen de tu servidor)
- **Servidor interno en oficina** (mini-PC + Tailscale)
- **Airtable + n8n + WATI** (alineado con tu stack actual)

Cualquiera de las 3 requiere ~1 día de trabajo. Pero ya estás validado con la versión actual.
