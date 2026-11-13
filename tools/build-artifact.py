#!/usr/bin/env python3
"""Fabrique la version Claude (artefact) de Mitonne à partir d'index.html.

Usage : python3 tools/build-artifact.py SORTIE.html

L'artefact n'a ni manifeste ni icônes à côté de la page : on retire ces liens,
on garde tout le reste (titre, polices Google, style, page et script).
"""
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src = (root / "index.html").read_text(encoding="utf-8")
out = src
for pat in (r'<link rel="manifest"[^>]*>\n?', r'<link rel="icon"[^>]*>\n?', r'<link rel="apple-touch-icon"[^>]*>\n?',
            r'<meta name="apple-mobile-web-app-[^"]*"[^>]*>\n?'):
    out = re.sub(pat, "", out)
if '<meta name="claude:viewport-fit-sides"' not in out:
    out = out.replace("<title>Mitonne</title>", '<title>Mitonne</title>\n<meta name="claude:viewport-fit-sides" content="cover">', 1)
for bad in ("manifest.webmanifest", "apple-touch-icon", 'href="icons/'):
    if bad in out:
        sys.exit("Lien restant vers un fichier absent de l'artefact : " + bad)
if not out.lstrip().lower().startswith("<!doctype html>"):
    sys.exit("La page doit commencer par <!DOCTYPE html>")
dest = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "artifact.html"
dest.write_text(out, encoding="utf-8")
print(f"Version Claude écrite dans {dest} ({len(out)} caractères)")
