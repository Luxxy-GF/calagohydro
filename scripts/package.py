#!/usr/bin/env python3
"""Package CalagoHydro source into an installable Calagopus extension archive."""
from pathlib import Path
import hashlib
import json
import tomllib
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SKIP = {"node_modules", "target", "dist", ".git", "__pycache__"}


def main():
    version = tomllib.loads((ROOT / "backend/Cargo.toml").read_text())["package"]["version"]
    assert json.loads((ROOT / "frontend/package.json").read_text())["version"] == version
    files = [ROOT / "Metadata.toml", ROOT / "NOTICE"]
    files += list(ROOT.glob("LICENSE*"))
    for folder in ("backend", "frontend"):
        files += [p for p in (ROOT / folder).rglob("*")
                  if p.is_file() and not SKIP.intersection(p.relative_to(ROOT).parts)
                  and not p.name.startswith(".env")]
    files = sorted(set(files))
    out = ROOT / "dist" / f"calagohydro-{version}.c7s.zip"
    out.parent.mkdir(exist_ok=True)
    dirs = sorted({parent.as_posix() + "/" for p in files
                   for parent in p.relative_to(ROOT).parents if parent != Path(".")})
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for directory in dirs:
            archive.writestr(directory, b"")
        for file in files:
            archive.write(file, file.relative_to(ROOT).as_posix())
    with zipfile.ZipFile(out) as archive:
        assert archive.testzip() is None
        assert {"Metadata.toml", "backend/Cargo.toml", "backend/src/lib.rs",
                "frontend/package.json", "frontend/src/index.tsx"}.issubset(archive.namelist())
    digest = hashlib.sha256(out.read_bytes()).hexdigest()
    (out.parent / "SHA256SUMS").write_text(f"{digest}  {out.name}\n")
    print(f"{out}: {len(files)} files, {out.stat().st_size} bytes")


if __name__ == "__main__":
    main()
