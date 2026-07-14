from http.server import BaseHTTPRequestHandler
import json

SONGS = [
    {
        "id": 1,
        "title": "Electric Dreams",
        "artist": "Luna Echo",
        "album": "Neon Horizon",
        "duration": "4:32",
        "durationSecs": 272,
        "genre": "Electronic",
        "year": 2024,
        "cover": "https://picsum.photos/seed/elec1/300/300",
        "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "color": "#0d1b4b"
    },
    {
        "id": 2,
        "title": "Midnight Groove",
        "artist": "The Jazz Collective",
        "album": "Blue Hour",
        "duration": "3:58",
        "durationSecs": 238,
        "genre": "Jazz",
        "year": 2024,
        "cover": "https://picsum.photos/seed/jazz2/300/300",
        "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "color": "#1a0a40"
    },
    {
        "id": 3,
        "title": "Urban Pulse",
        "artist": "Metro Beats",
        "album": "City Lights",
        "duration": "3:45",
        "durationSecs": 225,
        "genre": "Hip Hop",
        "year": 2024,
        "cover": "https://picsum.photos/seed/urb3/300/300",
        "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        "color": "#0a2010"
    },
    {
        "id": 4,
        "title": "Neon Lights",
        "artist": "Synthwave Republic",
        "album": "Retro Future",
        "duration": "5:12",
        "durationSecs": 312,
        "genre": "Synthwave",
        "year": 2024,
        "cover": "https://picsum.photos/seed/neon4/300/300",
        "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        "color": "#3a0a20"
    },
    {
        "id": 5,
        "title": "Deep Blue Ocean",
        "artist": "Ambient Soul",
        "album": "Depths",
        "duration": "6:24",
        "durationSecs": 384,
        "genre": "Ambient",
        "year": 2024,
        "cover": "https://picsum.photos/seed/ocean5/300/300",
        "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        "color": "#0a1a3e"
    },
    {
        "id": 6,
        "title": "Fire Dance",
        "artist": "Salsa Moderna",
        "album": "Caliente",
        "duration": "3:28",
        "durationSecs": 208,
        "genre": "Latin",
        "year": 2024,
        "cover": "https://picsum.photos/seed/fire6/300/300",
        "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        "color": "#3a1a00"
    },
    {
        "id": 7,
        "title": "Rising Sun",
        "artist": "Orchestral Dreams",
        "album": "Epic Canvas",
        "duration": "4:55",
        "durationSecs": 295,
        "genre": "Orchestral",
        "year": 2024,
        "cover": "https://picsum.photos/seed/sun7/300/300",
        "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        "color": "#3a2800"
    },
    {
        "id": 8,
        "title": "Shadow Run",
        "artist": "Dark Matter",
        "album": "Void",
        "duration": "4:18",
        "durationSecs": 258,
        "genre": "Dark Electronic",
        "year": 2024,
        "cover": "https://picsum.photos/seed/shad8/300/300",
        "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        "color": "#0a0a20"
    },
    {
        "id": 9,
        "title": "Golden Era",
        "artist": "Retro Vibes",
        "album": "Throwback",
        "duration": "3:52",
        "durationSecs": 232,
        "genre": "R&B",
        "year": 2024,
        "cover": "https://picsum.photos/seed/gold9/300/300",
        "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        "color": "#2e1800"
    },
    {
        "id": 10,
        "title": "Crystal Clear",
        "artist": "Indie Flow",
        "album": "Transparent",
        "duration": "4:05",
        "durationSecs": 245,
        "genre": "Indie",
        "year": 2024,
        "cover": "https://picsum.photos/seed/crys10/300/300",
        "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        "color": "#003030"
    }
]


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        data = json.dumps({
            "songs": SONGS,
            "total": len(SONGS),
            "featured": SONGS[:3]
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
        pass  # Suppress default logging
