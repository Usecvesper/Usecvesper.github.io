"""Build a local image manifest from folders uploaded to GitHub."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'assets' / 'albums'
EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'}
albums = {}
if BASE.exists():
    for folder in sorted(BASE.iterdir()):
        if folder.is_dir():
            images = [p.relative_to(ROOT).as_posix() for p in sorted(folder.rglob('*'))
                      if p.is_file() and p.suffix.lower() in EXTENSIONS]
            if images:
                albums[folder.name] = images
(ROOT / 'albums.json').write_text(json.dumps(albums, ensure_ascii=False, indent=2) + '\n')
print(f'{len(albums)} albums, {sum(map(len, albums.values()))} photographs')
