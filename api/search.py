from http.server import BaseHTTPRequestHandler
import urllib.parse
import json
import yt_dlp

def map_youtube_entry(entry):
    video_id = entry.get('id')
    duration_secs = entry.get('duration') or 0
    minutes = int(duration_secs // 60)
    seconds = int(duration_secs % 60)
    duration_str = f"{minutes}:{seconds:02d}"
    
    # YouTube thumbnails
    thumbnail = entry.get('thumbnail') or f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
    
    title = entry.get('title', 'Unknown Title')
    uploader = entry.get('uploader', 'Unknown Artist')
    
    # Hash title to get a consistent background color
    colors = ['#0d1b4b', '#1a0a40', '#0a2010', '#3a0a20', '#0a1a3e', '#3a1a00', '#3a2800', '#0a0a20', '#2e1800', '#003030']
    
    # Simple hash function in python
    h = 0
    for char in (title + str(video_id)):
        h = ord(char) + ((h << 5) - h)
    color = colors[abs(h) % len(colors)]
    
    return {
        "id": video_id,
        "title": title,
        "artist": uploader,
        "album": "YouTube Release",
        "genre": "Music",
        "year": 2026,
        "cover": thumbnail,
        "audio": f"/api/stream?id={video_id}",
        "color": color,
        "duration": duration_str,
        "durationSecs": duration_secs
    }


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        q = query_params.get('q', [''])[0]

        results = []
        if q:
            ydl_opts = {
                'format': 'bestaudio/best',
                'noplaylist': True,
                'quiet': True,
                'default_search': 'ytsearch',
                'nocheckcertificate': True
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                try:
                    search_results = ydl.extract_info(f"ytsearch10:{q}", download=False)
                    if 'entries' in search_results:
                        for entry in search_results['entries']:
                            results.append(map_youtube_entry(entry))
                except Exception as e:
                    print(f"Error searching YouTube: {e}")

        data = json.dumps({
            "songs": results,
            "total": len(results)
        })

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(data.encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        pass
