"""Build small gallery previews without changing the uploaded originals."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps
import argparse

def optimise(source, destination):
    relative = source.relative_to(Path("assets"))
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")
        sizes = []
        for label, edge, quality in [("thumb", 640, 76), ("view", 1920, 84)]:
            target = destination / "assets" / "optimized" / relative.parent / (relative.name + "." + label + ".webp")
            target.parent.mkdir(parents=True, exist_ok=True)
            resized = image.copy()
            resized.thumbnail((edge, edge), Image.Resampling.LANCZOS)
            resized.save(target, "WEBP", quality=quality, method=4)
            sizes.append(target.stat().st_size)
    return sum(sizes)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="_site")
    args = parser.parse_args()
    destination = Path(args.output)
    images = sorted(p for p in Path("assets/albums").rglob("*")
                    if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".avif"})
    with ThreadPoolExecutor(max_workers=2) as pool:
        total = sum(pool.map(lambda p: optimise(p, destination), images))
    print(f"Built {len(images)} thumbnail/view pairs: {total / 1_000_000:.1f} MB")

if __name__ == "__main__":
    main()
