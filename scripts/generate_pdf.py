from __future__ import annotations

import datetime as dt
import os
from pathlib import Path
from typing import Iterable

ROOT = Path(r"C:\Users\david\source\repos\semperfiservice-site-github")
OUTPUT = Path(r"C:\Users\david\source\repos\semperfiservice-site-github\scripts\sfsdistribution_code_dump.pdf")

TEXT_EXTENSIONS = {
    ".html", ".css", ".js", ".json", ".md", ".txt", ".xml",
    ".py", ".ps1", ".bat", ".cmd", ".yml", ".yaml",
    ".gitignore", ".env", ".ini", ".cfg", ".toml",
}

SKIP_DIR_NAMES = {
    "__pycache__", ".git", ".vs", ".venv", "venv",
    ".mypy_cache", ".pytest_cache", "node_modules",
}

MAX_INLINE_TEXT_BYTES = 2_000_000


def is_text_like(path: Path) -> bool:
    name = path.name.lower()
    suffix = path.suffix.lower()
    return suffix in TEXT_EXTENSIONS or name in TEXT_EXTENSIONS


def should_skip_dir(path: Path) -> bool:
    return path.name.lower() in {name.lower() for name in SKIP_DIR_NAMES}


def iter_files(root: Path) -> Iterable[Path]:
    for current_root, dirnames, filenames in os.walk(root):
        current_path = Path(current_root)
        dirnames[:] = [
            d for d in sorted(dirnames)
            if not should_skip_dir(current_path / d)
        ]

        for filename in sorted(filenames):
            yield current_path / filename


def build_directory_tree(root: Path) -> list[str]:
    lines: list[str] = [f"{root.name}/"]

    def walk_dir(dir_path: Path, prefix: str) -> None:
        children = sorted(
            [p for p in dir_path.iterdir() if not (p.is_dir() and should_skip_dir(p))],
            key=lambda p: (not p.is_dir(), p.name.lower()),
        )

        for index, child in enumerate(children):
            is_last = index == len(children) - 1
            branch = "`-- " if is_last else "|-- "
            lines.append(f"{prefix}{branch}{child.name}")

            if child.is_dir():
                extension = "    " if is_last else "|   "
                walk_dir(child, prefix + extension)

    walk_dir(root, "")
    return [f"{line_number:04d}: {line}" for line_number, line in enumerate(lines, start=1)]

def safe_read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        try:
            return path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            return path.read_text(encoding="cp1252", errors="replace")


def file_summary_line(path: Path, root: Path) -> str:
    rel = path.relative_to(root)
    stat = path.stat()
    kind = "TEXT" if is_text_like(path) else "BINARY"
    modified = dt.datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S")
    return f"{rel} | {kind} | {stat.st_size} bytes | modified {modified}"


def build_report_lines(root: Path) -> list[str]:
    lines: list[str] = []
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    all_files = list(iter_files(root))
    text_files = [p for p in all_files if is_text_like(p)]
    binary_files = [p for p in all_files if not is_text_like(p)]

    lines.append("SFSDISTRIBUTION WEBSITE CODE DUMP")
    lines.append("=" * 80)
    lines.append(f"Project root: {root}")
    lines.append(f"Generated:    {now}")
    lines.append(f"Total files:  {len(all_files)}")
    lines.append(f"Text files:   {len(text_files)}")
    lines.append(f"Binary files: {len(binary_files)}")
    lines.append("")

    lines.append("DIRECTORY TREE")
    lines.append("=" * 80)
    lines.extend(build_directory_tree(root))
    lines.append("")

    lines.append("FILE INVENTORY")
    lines.append("=" * 80)
    for path in all_files:
        lines.append(file_summary_line(path, root))
    lines.append("")

    lines.append("FILE CONTENTS")
    lines.append("=" * 80)

    for path in all_files:
        rel = path.relative_to(root)
        stat = path.stat()

        lines.append("")
        lines.append("-" * 80)
        lines.append(f"FILE: {rel}")
        lines.append(f"TYPE: {'TEXT' if is_text_like(path) else 'BINARY'}")
        lines.append(f"SIZE: {stat.st_size} bytes")
        lines.append(f"MODIFIED: {dt.datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S')}")
        lines.append("-" * 80)

        if not is_text_like(path):
            lines.append("[binary file listed but omitted from inline dump]")
            continue

        if stat.st_size > MAX_INLINE_TEXT_BYTES:
            lines.append(f"[text file omitted because it exceeds {MAX_INLINE_TEXT_BYTES} bytes]")
            continue

        try:
            content = safe_read_text(path)
        except Exception as exc:
            lines.append(f"[failed to read file: {exc}]")
            continue

        content_lines = content.splitlines()

        if not content_lines:
            lines.append("0001: ")
            continue

        for line_number, raw_line in enumerate(content_lines, start=1):
            lines.append(f"{line_number:04d}: {raw_line.expandtabs(4)}")

    return lines


def wrap_line(line: str, max_chars: int) -> list[str]:
    if line == "":
        return [""]

    chunks: list[str] = []
    remaining = line

    while len(remaining) > max_chars:
        split_at = remaining.rfind(" ", 0, max_chars)

        if split_at <= 0:
            split_at = max_chars

        chunks.append(remaining[:split_at])
        remaining = remaining[split_at:].lstrip()

    chunks.append(remaining)
    return chunks


def paginate_lines(lines: list[str], max_chars: int = 95, lines_per_page: int = 68) -> list[list[str]]:
    wrapped: list[str] = []

    for line in lines:
        wrapped.extend(wrap_line(line, max_chars))

    pages: list[list[str]] = []

    for index in range(0, len(wrapped), lines_per_page):
        pages.append(wrapped[index:index + lines_per_page])

    return pages or [[]]


def pdf_escape(text: str) -> str:
    return (
        text.replace("\\", "\\\\")
        .replace("(", "\\(")
        .replace(")", "\\)")
    )


def build_pdf_bytes(pages: list[list[str]], title: str) -> bytes:
    page_width = 612
    page_height = 792
    margin_left = 36
    margin_top = 36
    font_size = 8
    line_height = 10

    objects: list[bytes] = []

    def add_obj(data: str | bytes) -> int:
        if isinstance(data, str):
            data = data.encode("latin-1", errors="replace")
        objects.append(data)
        return len(objects)

    catalog_id = add_obj("<< /Type /Catalog /Pages 2 0 R >>")
    pages_id = add_obj("<< /Type /Pages /Kids [] /Count 0 >>")
    font_id = add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>")

    page_ids: list[int] = []

    for page_number, page_lines in enumerate(pages, start=1):
        content_parts: list[str] = [
            "BT",
            f"/F1 {font_size} Tf",
            f"{line_height} TL",
            f"{margin_left} {page_height - margin_top} Td",
            f"({pdf_escape(title)} | Page {page_number}) Tj",
            "T*",
            f"({'-' * 100}) Tj",
            "T*",
        ]

        for line in page_lines:
            content_parts.append(f"({pdf_escape(line)}) Tj")
            content_parts.append("T*")

        content_parts.append("ET")

        content_stream = "\n".join(content_parts).encode("latin-1", errors="replace")
        content_obj = (
            f"<< /Length {len(content_stream)} >>\nstream\n".encode("latin-1")
            + content_stream
            + b"\nendstream"
        )

        content_id = add_obj(content_obj)

        page_obj = (
            f"<< /Type /Page /Parent {pages_id} 0 R "
            f"/MediaBox [0 0 {page_width} {page_height}] "
            f"/Resources << /Font << /F1 {font_id} 0 R >> >> "
            f"/Contents {content_id} 0 R >>"
        )

        page_id = add_obj(page_obj)
        page_ids.append(page_id)

    kids = " ".join(f"{page_id} 0 R" for page_id in page_ids)
    objects[pages_id - 1] = (
        f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>"
    ).encode("latin-1")

    output = bytearray()
    output.extend(b"%PDF-1.4\n%\xE2\xE3\xCF\xD3\n")

    offsets = [0]

    for index, obj in enumerate(objects, start=1):
        offsets.append(len(output))
        output.extend(f"{index} 0 obj\n".encode("latin-1"))
        output.extend(obj)
        output.extend(b"\nendobj\n")

    xref_position = len(output)
    output.extend(f"xref\n0 {len(objects) + 1}\n".encode("latin-1"))
    output.extend(b"0000000000 65535 f \n")

    for offset in offsets[1:]:
        output.extend(f"{offset:010d} 00000 n \n".encode("latin-1"))

    output.extend(
        (
            f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_id} 0 R >>\n"
            f"startxref\n{xref_position}\n%%EOF\n"
        ).encode("latin-1")
    )

    return bytes(output)


def main() -> int:
    if not ROOT.exists() or not ROOT.is_dir():
        print(f"ERROR: folder not found: {ROOT}")
        return 1

    report_lines = build_report_lines(ROOT)
    pages = paginate_lines(report_lines)
    pdf_bytes = build_pdf_bytes(pages, title="sfsdistribution code dump")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_bytes(pdf_bytes)

    print(f"PDF created: {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())