"""
Parser del reloj #2 (PDF Original Records Report).

Este reloj no permite Standard Report — solo escupe PDF crudo con eventos.
Cada línea tiene: ID, Nombre, Fecha, Hora, Status (Check-in/Check-out/Overtime-In).

Reutiliza classify_day() de parser.py para aplicar el mismo algoritmo validado
contra SANDRA (100% match en Fase 2).

Output: outputs/horarios_pdf.xlsx con el MISMO formato que horarios_parseados.xlsx
"""
from __future__ import annotations
import re
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict
import pdfplumber

from parser import classify_day, write_xlsx  # reuse validated logic

INPUT_PDF = Path("inputs/report.pdf")
OUTPUT = Path("outputs/horarios_pdf.xlsx")
OUTPUT_REVISION = Path("outputs/revision_manual_pdf.xlsx")

# Regex de eventos del PDF: 'ID Nombre New Organization YYYY-MM-DD HH:MM:SS Status
EVENT_RE = re.compile(
    r"'(\d+)\s+(.+?)\s+New Organization\s+"
    r"(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}):\d{2}\s+"
    r"(Check-in|Check-out|Overtime-In)"
)


def extract_events(pdf_path: Path) -> list[dict]:
    """Devuelve lista de eventos: {id, nombre, fecha, hora_hhmm, status}."""
    events = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            for line in text.split("\n"):
                m = EVENT_RE.search(line)
                if m:
                    events.append({
                        "id": m.group(1),
                        "nombre": m.group(2).strip(),
                        "fecha": m.group(3),
                        "hora": m.group(4),
                        "status": m.group(5),
                    })
    return events


def get_period(events: list[dict]) -> tuple[datetime, datetime]:
    fechas = sorted({e["fecha"] for e in events})
    return (datetime.strptime(fechas[0], "%Y-%m-%d"),
            datetime.strptime(fechas[-1], "%Y-%m-%d"))


def normalize_name(name: str) -> str:
    """Limpia variantes triviales para agrupar por persona."""
    return " ".join(name.split())


def process(pdf_path: Path, output: Path, output_rev: Path) -> None:
    events = extract_events(pdf_path)
    print(f"Eventos extraídos del PDF: {len(events)}")
    if not events:
        raise ValueError("No se extrajeron eventos. ¿Cambió el formato del PDF?")

    start, end = get_period(events)
    num_days = (end - start).days + 1
    print(f"Período: {start.date()} a {end.date()} ({num_days} días)")

    # Agrupar por (id, fecha) -> lista de horas
    grouped: dict[tuple[str, str], list[str]] = defaultdict(list)
    id_to_name: dict[str, str] = {}
    for e in events:
        key = (e["id"], e["fecha"])
        grouped[key].append(e["hora"])
        id_to_name[e["id"]] = normalize_name(e["nombre"])

    persons = sorted(id_to_name.keys(), key=lambda k: id_to_name[k])
    print(f"Personas únicas en PDF: {len(persons)}")
    for pid in persons:
        nm = id_to_name[pid]
        total = sum(1 for k in grouped if k[0] == pid)
        print(f"  ID {pid} | {nm:20s} | {total} días con fichajes")

    rows = []
    revision_rows = []
    for pid in persons:
        nombre = id_to_name[pid]
        for d in range(num_days):
            fecha = start + timedelta(days=d)
            fecha_s = fecha.strftime("%Y-%m-%d")
            fichajes_raw = grouped.get((pid, fecha_s), [])

            # Aplicar misma limpieza que parser.py (dedupe, sort)
            cleaned: list[str] = []
            for t in fichajes_raw:
                if t == "00:00":
                    continue
                cleaned.append(t)
            # Sort y dedup cercanos (< 2 min)
            cleaned.sort()
            final: list[str] = []
            for t in cleaned:
                if final and abs(_min(t) - _min(final[-1])) < 2:
                    continue
                final.append(t)

            res = classify_day(final)
            row = {
                "ID": pid,
                "Nombre": nombre,
                "Fecha": fecha_s,
                "Día": fecha.strftime("%a %d"),
                "Raw": " ".join(fichajes_raw),
                "Fichajes": " | ".join(final),
                "N": res["n_fichajes"],
                "ENT_AM": res["ENT_AM"],
                "SAL_AM": res["SAL_AM"],
                "ENT_PM": res["ENT_PM"],
                "SAL_PM": res["SAL_PM"],
                "Estado": res["estado"],
                "Observación": res["obs"],
            }
            rows.append(row)
            if res["estado"] in ("REVISION", "INCOMPLETO"):
                revision_rows.append(row)

    output.parent.mkdir(parents=True, exist_ok=True)
    write_xlsx(rows, output, highlight=True)
    write_xlsx(revision_rows, output_rev, highlight=True)

    print(f"\nGenerado: {output}")
    print(f"Generado: {output_rev}")
    import pandas as pd
    estados = pd.Series([r["Estado"] for r in rows]).value_counts()
    print("\nResumen:")
    for k, v in estados.items():
        print(f"  {k}: {v}")


def _min(s: str) -> int:
    h, m = s.split(":")
    return int(h) * 60 + int(m)


if __name__ == "__main__":
    process(INPUT_PDF, OUTPUT, OUTPUT_REVISION)
