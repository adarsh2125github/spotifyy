from http.server import BaseHTTPRequestHandler
import urllib.parse
import yt_dlp

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        video_id = query_params.get('id', [''])[0]

        if video_id:
            ydl_opts = {
                'format': 'bestaudio/best',
                'quiet': True,
                'nocheckcertificate': True
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                try:
                    info = ydl.extract_info(video_id, download=False)
                    audio_url = info.get('url')
                    
                    self.send_response(302)
                    self.send_header('Location', audio_url)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    return
                except Exception as e:
                    print(f"Error extracting stream URL: {e}")
                    
        self.send_response(404)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(b'{"error": "Track not found"}')
