"""
Aplicación web local para Lili.
Procesa la nómina quincenal arrastrando 3 archivos y descargando el Excel prellenado.

Corre con: streamlit run app.py
Se abre en el navegador en http://localhost:8501
Los datos NUNCA salen de la PC.
"""
from __future__ import annotations
import io
import shutil
import tempfile
from pathlib import Path
import streamlit as st
import pandas as pd

from parser import process as parser_xls
from parser_pdf import process as parser_pdf_run
from inject import inject as inject_run


st.set_page_config(
    page_title="Nómina Cotorreo",
    page_icon="💼",
    layout="centered",
)


def check_password() -> bool:
    """
    Login simple por contraseña. Solo se activa si existe st.secrets['password'].
    En modo local (sin secrets) la app no pide login.
    Para Streamlit Cloud: configurar la contraseña en Settings → Secrets.
    """
    try:
        expected = st.secrets["password"]
    except (KeyError, FileNotFoundError):
        return True  # Modo local sin auth

    if st.session_state.get("auth_ok"):
        return True

    st.title("🔒 Procesador de Nómina")
    st.write("Esta aplicación requiere contraseña.")
    pwd = st.text_input("Contraseña", type="password")
    if st.button("Entrar"):
        if pwd == expected:
            st.session_state["auth_ok"] = True
            st.rerun()
        else:
            st.error("Contraseña incorrecta")
    st.caption("Versión web pública · Datos se procesan en memoria y se borran al cerrar la pestaña")
    return False


if not check_password():
    st.stop()

# Estilos
st.markdown("""
<style>
    .big-number { font-size: 48px; font-weight: bold; color: #4F46E5; }
    .label { font-size: 14px; color: #6B7280; text-transform: uppercase; }
    .success-banner { background: #D1FAE5; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981; }
    .warning-banner { background: #FEF3C7; padding: 16px; border-radius: 8px; border-left: 4px solid #F59E0B; }
    div[data-testid="stFileUploader"] { background: #F9FAFB; padding: 12px; border-radius: 8px; }
</style>
""", unsafe_allow_html=True)

# Header
st.title("Procesador de Nómina")
st.caption("Grupo Cotorreo · Sistema quincenal automatizado")

st.write("""
**Cómo funciona:** Sube los 3 archivos abajo. El sistema lee los fichajes de los dos
relojes, identifica entradas y salidas por persona/día, y prellena tu Excel de nómina.
**Los datos no salen de esta computadora.**
""")

st.markdown("---")

# === Sección de uploads ===
st.subheader("Paso 1: Sube los 3 archivos")

col1, col2 = st.columns(2)

with col1:
    st.markdown("**Reloj #1 — Plaza Cotorreo**")
    f_xls = st.file_uploader(
        "Standard Report (archivo .xls)",
        type=["xls", "xlsx"],
        key="xls",
        label_visibility="collapsed",
    )
    st.caption("Archivo Excel del reloj principal")

with col2:
    st.markdown("**Reloj #2 — Otra ubicación**")
    f_pdf = st.file_uploader(
        "Original Records (archivo .pdf)",
        type=["pdf"],
        key="pdf",
        label_visibility="collapsed",
    )
    st.caption("Archivo PDF del reloj de la otra sucursal")

st.markdown("**Tu planilla quincenal**")
f_nomina = st.file_uploader(
    "NOMINA xxx.xlsx (tu Excel de cálculo)",
    type=["xlsx"],
    key="nomina",
    label_visibility="collapsed",
)
st.caption("El Excel que vas a usar esta quincena (con tus fórmulas y hojas por colaborador)")

st.markdown("---")

# === Botón de procesamiento ===
st.subheader("Paso 2: Procesar")

all_ready = f_xls is not None and f_pdf is not None and f_nomina is not None
if not all_ready:
    st.info("Sube los 3 archivos para activar el botón de procesamiento.")

procesar = st.button(
    "Procesar nómina",
    type="primary",
    disabled=not all_ready,
    use_container_width=True,
)

if procesar and all_ready:
    workdir = Path(tempfile.mkdtemp(prefix="nomina_"))
    try:
        # Guardar uploads en carpeta temporal
        inputs = workdir / "inputs"
        outputs = workdir / "outputs"
        inputs.mkdir()
        outputs.mkdir()

        p_xls = inputs / f_xls.name
        p_pdf = inputs / f_pdf.name
        p_nomina = inputs / f_nomina.name
        for src_file, dst in [(f_xls, p_xls), (f_pdf, p_pdf), (f_nomina, p_nomina)]:
            with open(dst, "wb") as f:
                f.write(src_file.getbuffer())

        progress_text = st.empty()
        progress_bar = st.progress(0)

        progress_text.write("**Paso 1/3** — Leyendo fichajes del reloj #1...")
        progress_bar.progress(20)
        parser_xls(p_xls, outputs)

        progress_text.write("**Paso 2/3** — Leyendo fichajes del reloj #2 (PDF)...")
        progress_bar.progress(50)
        parser_pdf_run(p_pdf, outputs / "horarios_pdf.xlsx", outputs / "revision_manual_pdf.xlsx")

        progress_text.write("**Paso 3/3** — Escribiendo horarios en tu planilla...")
        progress_bar.progress(80)
        out_path = outputs / f"{p_nomina.stem} - PRELLENADO.xlsx"
        result = inject_run(
            input_nomina=p_nomina,
            input_sr=outputs / "horarios_parseados.xlsx",
            input_pdf=outputs / "horarios_pdf.xlsx",
            output=out_path,
            log_fn=lambda _msg: None,  # silencioso para no contaminar UI
        )

        progress_bar.progress(100)
        progress_text.empty()
        progress_bar.empty()

        st.markdown("---")
        st.markdown('<div class="success-banner"><b>✓ Listo. Tu planilla está prellenada.</b></div>', unsafe_allow_html=True)

        # === Resumen ===
        st.subheader("Resumen")
        c1, c2, c3 = st.columns(3)
        with c1:
            st.markdown(f'<div class="label">Días procesados</div>', unsafe_allow_html=True)
            st.markdown(f'<div class="big-number">{result["total_dias"]}</div>', unsafe_allow_html=True)
        with c2:
            st.markdown(f'<div class="label">Para revisar</div>', unsafe_allow_html=True)
            st.markdown(f'<div class="big-number" style="color:#F59E0B;">{result["total_revision"]}</div>', unsafe_allow_html=True)
        with c3:
            st.markdown(f'<div class="label">Colaboradores</div>', unsafe_allow_html=True)
            st.markdown(f'<div class="big-number">{len(result["detalle"])}</div>', unsafe_allow_html=True)

        # === Botón de descarga ===
        st.markdown("---")
        st.subheader("Paso 3: Descarga tu Excel prellenado")
        with open(out_path, "rb") as f:
            xlsx_data = f.read()
        st.download_button(
            label=f"⬇ Descargar {out_path.name}",
            data=xlsx_data,
            file_name=out_path.name,
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            type="primary",
            use_container_width=True,
        )

        # === Aviso revisión ===
        if result["total_revision"] > 0:
            st.markdown(f"""
<div class="warning-banner">
<b>{result['total_revision']} días marcados para que revises tú</b><br>
En el Excel verás celdas pintadas en <span style="background:#FFE699;padding:2px 6px;">amarillo</span>
(ambiguo) o <span style="background:#F4B084;padding:2px 6px;">naranja</span> (marca incompleta).
Solo necesitas revisar esas y completar con tu criterio.
</div>
""", unsafe_allow_html=True)

        # === Tabla detalle ===
        st.markdown("---")
        with st.expander("Ver detalle por colaborador"):
            df = pd.DataFrame(result["detalle"])
            st.dataframe(df, use_container_width=True, hide_index=True)

    except Exception as e:
        st.error(f"**Hubo un problema:** {e}")
        st.caption("Si el problema persiste, comparte el mensaje completo con quien te ayudó a montar el sistema.")
        import traceback
        with st.expander("Detalle técnico (para soporte)"):
            st.code(traceback.format_exc())
    finally:
        # Limpiar carpeta temporal después de un rato (Streamlit la mantiene hasta refresh)
        pass

# === Footer ===
st.markdown("---")
try:
    _ = st.secrets["password"]
    st.caption("v1.0 · Versión web · Datos en memoria, se borran al cerrar la pestaña")
    if st.button("Cerrar sesión", key="logout"):
        st.session_state["auth_ok"] = False
        st.rerun()
except (KeyError, FileNotFoundError):
    st.caption("v1.0 · Procesa local, no envía datos a internet · Para soporte: contactar a Vicente")
