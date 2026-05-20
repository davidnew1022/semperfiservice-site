from __future__ import annotations

import datetime as dt
import os
import sys
from pathlib import Path
from typing import Iterable

try:
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_LEFT
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.platypus import (
        PageBreak,
        Paragraph,
        Preformatted,
        SimpleDocTemplate,
        Spacer,
    )
except ImportError:
    print("ERROR: reportlab is required.")
    print("Run this once:")
    print("python -m pip install reportlab")
    raise SystemExit(1)


SCRIPT_PATH = Path(__file__).resolve()
SCRIPTS_DIR = SCRIPT_PATH.parent
ROOT = SCRIPTS_DIR.parent

OUTPUT = ROOT / "sfsdistribution_code_dump.pdf"

TEXT_EXTENSIONS = {
    ".html", ".css", ".js", ".json", ".md", ".txt", ".xml",
    ".py", ".ps1", ".bat", ".cmd", ".yml", ".yaml",
    ".gitignore", ".env", ".ini", ".cfg", ".toml",
}

SKIP_DIR_NAMES = {
    "__pycache__", ".git", ".vs", ".venv", "venv",
    ".mypy_cache", ".pytest_cache", "node_modules",
}

SKIP_FILE_NAMES = {
    "sfsdistribution_code_dump.pdf",
}

MAX_INLINE_TEXT_BYTES = 2_000_000


def is_text_like(path: Path) -> bool:
    name = path.name.lower()
    suffix = path.suffix.lower()
    return suffix in TEXT_EXTENSIONS or name in TEXT_EXTENSIONS


def should_skip_dir(path: Path) -> bool:
    return path.name.lower() in {name.lower() for name in SKIP_DIR_NAMES}


def should_skip_file(path: Path) -> bool:
    return path.name.lower() in {name.lower() for name in SKIP_FILE_NAMES}


def iter_files(root: Path) -> Iterable[Path]:
    for current_root, dirnames, filenames in os.walk(root):
        current_path = Path(current_root)

        dirnames[:] = [
            dirname
            for dirname in sorted(dirnames)
            if not should_skip_dir(current_path / dirname)
        ]

        for filename in sorted(filenames):
            path = current_path / filename

            if should_skip_file(path):
                continue

            yield path


def safe_relpath(path: Path, root: Path) -> str:
    return str(path.relative_to(root)).replace("/", "\\")


def format_modified_time(path: Path) -> str:
    try:
        modified = dt.datetime.fromtimestamp(path.stat().st_mtime)
        return modified.strftime("%Y-%m-%d %H:%M:%S")
    except OSError:
        return "unknown"


def read_text_file(path: Path) -> list[str]:
    raw = path.read_bytes()

    if len(raw) > MAX_INLINE_TEXT_BYTES:
        return [
            f"[text file omitted because it is larger than {MAX_INLINE_TEXT_BYTES:,} bytes]"
        ]

    encodings = ("utf-8-sig", "utf-8", "cp1252", "latin-1")

    for encoding in encodings:
        try:
            text = raw.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    else:
        text = raw.decode("utf-8", errors="replace")

    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text.split("\n")


def build_directory_tree(root: Path) -> list[str]:
    lines: list[str] = [f"{root.name}/"]

    all_paths = list(iter_files(root))
    folders = sorted({
        parent
        for path in all_paths
        for parent in path.relative_to(root).parents
        if str(parent) != "."
    })

    entries = sorted(
        [(folder, True) for folder in folders] +
        [(path.relative_to(root), False) for path in all_paths],
        key=lambda item: str(item[0]).lower()
    )

    for relative, is_dir in entries:
        depth = len(relative.parts) - 1
        indent = "|   " * depth
        marker = "|-- "
        suffix = "/" if is_dir else ""
        lines.append(f"{indent}{marker}{relative.name}{suffix}")

    return lines


def build_inventory(root: Path) -> list[str]:
    lines: list[str] = []

    for path in iter_files(root):
        try:
            size = path.stat().st_size
        except OSError:
            size = 0

        file_type = "TEXT" if is_text_like(path) else "BINARY"
        lines.append(
            f"{safe_relpath(path, root)} | {file_type} | {size} bytes | modified {format_modified_time(path)}"
        )

    return lines


def register_monospace_font() -> str:
    font_candidates = [
        Path(r"C:\Windows\Fonts\consola.ttf"),
        Path(r"C:\Windows\Fonts\cour.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"),
        Path("/usr/share/fonts/truetype/liberation2/LiberationMono-Regular.ttf"),
    ]

    for font_path in font_candidates:
        if font_path.exists():
            try:
                pdfmetrics.registerFont(TTFont("SFSMono", str(font_path)))
                return "SFSMono"
            except Exception:
                pass

    return "Courier"


def add_heading(story: list, text: str, style: ParagraphStyle) -> None:
    story.append(Paragraph(text, style))
    story.append(Spacer(1, 0.12 * inch))


def add_rule(story: list, mono_style: ParagraphStyle) -> None:
    story.append(Preformatted("-" * 100, mono_style))


def build_pdf(root: Path, output: Path) -> None:
    mono_font = register_monospace_font()

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "SFS_Title",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        alignment=TA_LEFT,
        spaceAfter=10,
    )

    heading_style = ParagraphStyle(
        "SFS_Heading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        alignment=TA_LEFT,
        spaceBefore=10,
        spaceAfter=6,
    )

    body_style = ParagraphStyle(
        "SFS_Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        alignment=TA_LEFT,
    )

    mono_style = ParagraphStyle(
        "SFS_Mono",
        fontName=mono_font,
        fontSize=6.5,
        leading=8,
        leftIndent=0,
        rightIndent=0,
        alignment=TA_LEFT,
        textColor=colors.black,
        splitLongWords=True,
    )

    doc = SimpleDocTemplate(
        str(output),
        pagesize=letter,
        rightMargin=0.45 * inch,
        leftMargin=0.45 * inch,
        topMargin=0.45 * inch,
        bottomMargin=0.45 * inch,
        title="sfsdistribution code dump",
        author="Semper Fi Services",
    )

    text_files = []
    binary_files = []

    for path in iter_files(root):
        if is_text_like(path):
            text_files.append(path)
        else:
            binary_files.append(path)

    story: list = []

    add_heading(story, "SFSDISTRIBUTION WEBSITE CODE DUMP", title_style)
    story.append(Paragraph(f"Project root: {root}", body_style))
    story.append(Paragraph(f"Generated: {dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", body_style))
    story.append(Paragraph(f"Total files: {len(text_files) + len(binary_files)}", body_style))
    story.append(Paragraph(f"Text files: {len(text_files)}", body_style))
    story.append(Paragraph(f"Binary files: {len(binary_files)}", body_style))
    story.append(Spacer(1, 0.2 * inch))

    add_heading(story, "DIRECTORY TREE", heading_style)
    story.append(Preformatted("\n".join(build_directory_tree(root)), mono_style))
    story.append(PageBreak())

    add_heading(story, "FILE INVENTORY", heading_style)
    story.append(Preformatted("\n".join(build_inventory(root)), mono_style))
    story.append(PageBreak())

    add_heading(story, "FILE CONTENTS", heading_style)

    for path in iter_files(root):
        rel = safe_relpath(path, root)
        file_type = "TEXT" if is_text_like(path) else "BINARY"

        add_rule(story, mono_style)
        story.append(Preformatted(f"FILE: {rel}", mono_style))
        story.append(Preformatted(f"TYPE: {file_type}", mono_style))

        try:
            story.append(Preformatted(f"SIZE: {path.stat().st_size} bytes", mono_style))
        except OSError:
            story.append(Preformatted("SIZE: unknown", mono_style))

        story.append(Preformatted(f"MODIFIED: {format_modified_time(path)}", mono_style))
        add_rule(story, mono_style)

        if file_type == "BINARY":
            story.append(Preformatted("[binary file listed but omitted from inline dump]", mono_style))
            story.append(Spacer(1, 0.1 * inch))
            continue

        try:
            lines = read_text_file(path)
        except Exception as exc:
            lines = [f"[unable to read file: {exc}]"]

        numbered = "\n".join(
            f"{index:04d}: {line}"
            for index, line in enumerate(lines, start=1)
        )

        story.append(Preformatted(numbered, mono_style))
        story.append(Spacer(1, 0.1 * inch))

    doc.build(story)


def main() -> int:
    if not ROOT.exists() or not ROOT.is_dir():
        print(f"ERROR: project root not found: {ROOT}")
        return 1

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    build_pdf(ROOT, OUTPUT)

    print(f"Project root: {ROOT}")
    print(f"PDF created: {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())