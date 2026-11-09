from flask import Flask, render_template, jsonify, request, send_file, abort
from pathlib import Path
import requests
import sqlite3
import mimetypes

BASE = Path(__file__).resolve().parent
IMAGE_DIR = BASE / "static" / "images"
IMAGE_DIR.mkdir(parents=True, exist_ok=True)
STATS_DB = BASE / "player_stats.sqlite3"

app = Flask(__name__)

def init_stats_db():
    with sqlite3.connect(STATS_DB) as db:
        db.execute("CREATE TABLE IF NOT EXISTS known_counts (character_id TEXT PRIMARY KEY, correct_guesses INTEGER NOT NULL DEFAULT 0)")

init_stats_db()


@app.route("/")
def home():
    """Serve the main game page at the site root."""
    return render_template("index.html")

# Wikimedia Commons file titles. The app downloads a 1200px preview on first run.
# Several pre-photography figures necessarily use later artistic depictions, not real photographs.
IMAGE_FILES = {
    "dali": "Salvador Dali.jpg",
    "dostoevsky": "Dostoevskij 1872.jpg",
    "fischer": "Bobby Fischer 1966 portrait.jpg",
    "aqqad": "Abbas Mahmud al-Aqqad.jpg",
    "gogol": "Н. В. Гоголь.png",
    "freud": "Freud 1885.jpg",
    "elia": "Elia Abu Madi.jpg",
    "haytham": "Ibn Al-Haytham portrait.jpg",
    "zahrawi": "Al-Zahrawi Portrait.jpg",
    "tufail": "Ibn Ṭufail, Sayr mulhimah min al-Sharq wa-al-Gharb.png",
}

def image_mime_and_valid(content):
    if content.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if content.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if content.startswith((b"GIF87a", b"GIF89a")):
        return "image/gif"
    if content.startswith(b"RIFF") and content[8:12] == b"WEBP":
        return "image/webp"
    return None

def image_path_for(key):
    # Accept files cached by earlier versions, regardless of their extension.
    for candidate in IMAGE_DIR.glob(f"{key}.*"):
        try:
            data = candidate.read_bytes()
            if len(data) >= 5000 and image_mime_and_valid(data):
                return candidate
        except OSError:
            continue
    return None

def commons_image_info(file_title):
    api = "https://commons.wikimedia.org/w/api.php"
    headers = {"User-Agent": "CharacterPuzzleGame/1.1 (educational personal project; image retrieval)"}
    params = {
        "action": "query", "format": "json", "titles": f"File:{file_title}",
        "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 1200,
    }
    response = requests.get(api, params=params, headers=headers, timeout=(4, 8))
    response.raise_for_status()
    pages = response.json().get("query", {}).get("pages", {})
    page = next(iter(pages.values()), {})
    info = (page.get("imageinfo") or [None])[0]
    if info:
        return info, file_title

    # Some Commons filenames change or differ in punctuation. Search by the
    # original title and use a matching file result instead of failing forever.
    query = file_title.rsplit(".", 1)[0].replace("_", " ")
    search_params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrnamespace": 6, "gsrlimit": 6, "gsrsearch": query,
        "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 1200,
    }
    search_response = requests.get(api, params=search_params, headers=headers, timeout=(4, 8))
    search_response.raise_for_status()
    results = search_response.json().get("query", {}).get("pages", {})
    # Prefer a result whose title resembles the requested portrait filename.
    candidates = sorted(results.values(), key=lambda item: (query.lower() not in item.get("title", "").lower(), item.get("title", "")))
    for candidate in candidates:
        found_info = (candidate.get("imageinfo") or [None])[0]
        if found_info:
            return found_info, candidate.get("title", file_title)
    raise RuntimeError(f"لم يتم العثور على ملف الصورة في ويكيميديا: {file_title}")

def download_commons_image(file_title, output_base):
    headers = {"User-Agent": "CharacterPuzzleGame/1.1 (educational personal project; image retrieval)"}
    info, resolved_title = commons_image_info(file_title)
    image_url = info.get("thumburl") or info.get("url")
    image_response = requests.get(image_url, headers=headers, timeout=(4, 12))
    image_response.raise_for_status()
    content = image_response.content
    mime = image_mime_and_valid(content)
    if len(content) < 5000 or not mime:
        raise RuntimeError(f"الملف المستلم ليس صورة صالحة: {resolved_title}")
    extension = {"image/jpeg":"jpg", "image/png":"png", "image/gif":"gif", "image/webp":"webp"}[mime]
    output_path = output_base.with_suffix("." + extension)
    output_path.write_bytes(content)

    meta = info.get("extmetadata", {})
    return output_path, {
        "file": resolved_title,
        "page": "https://commons.wikimedia.org/wiki/" + requests.utils.quote(resolved_title.replace(" ", "_"), safe=":/()'"),
        "author": meta.get("Artist", {}).get("value", "See Wikimedia Commons file page"),
        "license": meta.get("LicenseShortName", {}).get("value", "See Wikimedia Commons file page"),
        "license_url": meta.get("LicenseUrl", {}).get("value", ""),
        "credit": meta.get("Credit", {}).get("value", ""),
    }

def ensure_images():
    credits = {}
    missing = []
    for key, title in IMAGE_FILES.items():
        if image_path_for(key):
            continue
        try:
            _, credits[key] = download_commons_image(title, IMAGE_DIR / key)
        except Exception as exc:
            missing.append(f"{key}: {exc}")
    if credits:
        credits_file = BASE / "image_credits.json"
        existing = {}
        if credits_file.exists():
            try:
                existing = __import__("json").loads(credits_file.read_text(encoding="utf-8"))
            except Exception:
                pass
        existing.update(credits)
        credits_file.write_text(__import__("json").dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
    return missing

@app.route("/portrait/<key>")
def portrait(key):
    if key not in IMAGE_FILES:
        abort(404)
    path = image_path_for(key)
    if not path:
        abort(404)
    mime = image_mime_and_valid(path.read_bytes())
    return send_file(path, mimetype=mime, conditional=True, max_age=3600)

@app.route("/api/images-status")
def images_status():
    missing = [key for key in IMAGE_FILES if not image_path_for(key)]
    return jsonify({"ready": len(missing) == 0, "missing": missing})

@app.route("/api/known/<key>", methods=["GET", "POST"])
def known_count(key):
    if key not in IMAGE_FILES:
        return jsonify({"ok": False, "error": "Unknown portrait"}), 404
    with sqlite3.connect(STATS_DB) as db:
        if request.method == "POST":
            db.execute("INSERT INTO known_counts(character_id, correct_guesses) VALUES (?, 1) ON CONFLICT(character_id) DO UPDATE SET correct_guesses = correct_guesses + 1", (key,))
        row = db.execute("SELECT correct_guesses FROM known_counts WHERE character_id = ?", (key,)).fetchone()
    return jsonify({"ok": True, "count": row[0] if row else 0})

@app.route("/api/ensure-image/<key>")
def ensure_one_image(key):
    """Ensure a portrait exists and return its stable local URL."""
    if key not in IMAGE_FILES:
        return jsonify({"ok": False, "error": "Unknown portrait"}), 404
    path = image_path_for(key)
    if not path:
        try:
            path, _ = download_commons_image(IMAGE_FILES[key], IMAGE_DIR / key)
        except Exception as exc:
            return jsonify({"ok": False, "error": str(exc)}), 503
    return jsonify({"ok": True, "cached": True, "url": f"/portrait/{key}"})

if __name__ == "__main__":
    print("\nPreparing portraits from Wikimedia Commons (first launch only)...")
    missing = ensure_images()
    if missing:
        print("\nSome portraits could not be downloaded:")
        for item in missing:
            print(" -", item)
        print("Check your internet connection and run app.py again.")
    else:
        print("All 10 portraits are ready.")
    print("\nOpen http://127.0.0.1:5000 in your browser.\n")
    app.run(host="127.0.0.1", port=5000, debug=False)
