"""Import the original website once, preserving its media and editable sources."""
from pathlib import Path
import json, shutil, tempfile, tarfile, urllib.request
root=Path.cwd()
if (root/"content.js").exists():
    raise SystemExit("Website already imported.")
with tempfile.TemporaryDirectory() as temp:
    archive=Path(temp)/"source.tar.gz"
    urllib.request.urlretrieve("https://codeload.github.com/Usecvesper/Usec_Vesper/tar.gz/4843b1cec333b030225423ea89ceb8912e53bea6",archive)
    with tarfile.open(archive) as bundle:
        bundle.extractall(temp, filter="data")
    source=next(p for p in Path(temp).iterdir() if p.is_dir())
    for item in source.iterdir():
        if item.name==".github": continue
        target=root/item.name
        if item.is_dir(): shutil.copytree(item,target,dirs_exist_ok=True)
        else: shutil.copy2(item,target)
for path in root.rglob("*"):
    if not path.is_file() or ".git" in path.parts or path.resolve()==Path(__file__).resolve(): continue
    if path.suffix.lower() not in {".html",".js",".json",".md",".xml",".txt",".css",".py"}: continue
    text=path.read_text()
    text=text.replace("https://usecvesper.github.io/Usec_Vesper/","https://usecvesper.github.io/")
    text=text.replace("Usecvesper/Usec_Vesper","Usecvesper/Usecvesper.github.io")
    path.write_text(text)
data={"@context":"https://schema.org","@type":"WebSite","name":"USEC Vesper","alternateName":["USEC VESPER","Vesper","usecvesper.github.io"],"url":"https://usecvesper.github.io/"}
path=root/"index.html"
text=path.read_text()
text=text.replace("</head>",'<meta property="og:site_name" content="USEC Vesper">\n<script type="application/ld+json">'+json.dumps(data)+'</script>\n</head>')
path.write_text(text)
(root/"robots.txt").write_text("User-agent: *\nAllow: /\n\nSitemap: https://usecvesper.github.io/sitemap.xml\n")
(root/".nojekyll").touch()
print("Imported website from original commit 4843b1cec333b030225423ea89ceb8912e53bea6")
