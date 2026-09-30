"""Re-encode existing approved signatures at their delivery sizes; no artwork changes.

Requires Pillow. Original transparent artwork stays in design/source for later use.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
source = root / 'design/source'
public = root / 'public/assets'
signature = Image.open(source / 'signature.png').convert('RGBA')
signature.thumbnail((460, 460), Image.Resampling.LANCZOS)
signature.save(public / 'signature.png', optimize=True)
icon = Image.open(source / 'favicon-signature.png').convert('RGBA')
for size, name in [(48, 'favicon-signature.png'), (180, 'apple-touch-icon.png')]:
    mark = icon.copy()
    mark.thumbnail((size - 4, size - 4), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    canvas.save(public / name, optimize=True)
