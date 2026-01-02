import json
import os
import sys
import unicodedata

def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    return text.lower().replace(' ', '-').replace('1-', '1').replace('2-', '2').replace('3-', '3')

def structure_bible(input_file, version_id, version_name):
    content_dir = os.path.join('content', 'bible')
    version_dir = os.path.join(content_dir, version_id)
    
    if not os.path.exists(version_dir):
        os.makedirs(version_dir)
        
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    books_meta = []
    
    for book in data:
        book_name = book['name']
        book_slug = slugify(book_name)
        book_abbrev = book['abbrev']
        chapters = book['chapters']
        
        # Save individual book file
        book_file_path = os.path.join(version_dir, f"{book_slug}.json")
        with open(book_file_path, 'w', encoding='utf-8') as bf:
            json.dump({
                "name": book_name,
                "abbrev": book_abbrev,
                "chapters": chapters
            }, bf, ensure_ascii=False, indent=2)
            
        books_meta.append({
            "name": book_name,
            "slug": book_slug,
            "abbrev": book_abbrev,
            "chapters": len(chapters)
        })
        
    # Update versions.json
    versions_file = os.path.join(content_dir, 'versions.json')
    versions = []
    if os.path.exists(versions_file):
        with open(versions_file, 'r', encoding='utf-8') as vf:
            versions = json.load(vf)
            
    # Check if version already exists
    version_exists = False
    for v in versions:
        if v['id'] == version_id:
            v['name'] = version_name
            v['books'] = books_meta
            version_exists = True
            break
            
    if not version_exists:
        versions.append({
            "id": version_id,
            "name": version_name,
            "books": books_meta
        })
        
    with open(versions_file, 'w', encoding='utf-8') as vf:
        json.dump(versions, vf, ensure_ascii=False, indent=2)
        
    print(f"Successfully structured {version_name} ({version_id})")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 structure-bible.py <input_json> <version_id> <version_name>")
    else:
        structure_bible(sys.argv[1], sys.argv[2], sys.argv[3])
