from http.server import BaseHTTPRequestHandler
import json

SONGS = [
    {
        "id": "u6b8OPOfTnk",
        "title": "Blinding Lights",
        "artist": "The Weeknd",
        "album": "After Hours",
        "genre": "Synth-pop",
        "year": 2020,
        "cover": "https://i.scdn.co/image/ab67616d0000b273b526d17e57c6b541fc112678",
        "audio": "/api/stream?id=u6b8OPOfTnk",
        "color": "#0d1b4b",
        "duration": "3:21",
        "durationSecs": 201
    },
    {
        "id": "K5y2N0jZg8k",
        "title": "Shape of You",
        "artist": "Ed Sheeran",
        "album": "÷ (Divide)",
        "genre": "Pop",
        "year": 2017,
        "cover": "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b83884b268a0c5c",
        "audio": "/api/stream?id=K5y2N0jZg8k",
        "color": "#1a0a40",
        "duration": "3:53",
        "durationSecs": 233
    },
    {
        "id": "gOsM-DYAEhY",
        "title": "Believer",
        "artist": "Imagine Dragons",
        "album": "Evolve",
        "genre": "Alt-rock",
        "year": 2017,
        "cover": "https://i.scdn.co/image/ab67616d0000b2735f1fda6f9cf50c37747e9238",
        "audio": "/api/stream?id=gOsM-DYAEhY",
        "color": "#0a2010",
        "duration": "3:24",
        "durationSecs": 204
    },
    {
        "id": "AnMYEee45dM",
        "title": "Stay",
        "artist": "The Kid LAROI & Justin Bieber",
        "album": "F*CK LOVE 3: OVER YOU",
        "genre": "Pop-rock",
        "year": 2021,
        "cover": "https://i.scdn.co/image/ab67616d0000b27341e31d6eaadb0d06115b3769",
        "audio": "/api/stream?id=AnMYEee45dM",
        "color": "#3a0a20",
        "duration": "2:21",
        "durationSecs": 141
    },
    {
        "id": "34Na4j8AVgA",
        "title": "Starboy",
        "artist": "The Weeknd ft. Daft Punk",
        "album": "Starboy",
        "genre": "R&B/Electronic",
        "year": 2016,
        "cover": "https://i.scdn.co/image/ab67616d0000b2734718dec6954e110b45b0685d",
        "audio": "/api/stream?id=34Na4j8AVgA",
        "color": "#0a1a3e",
        "duration": "3:50",
        "durationSecs": 230
    },
    {
        "id": "H5v3kku4y6Q",
        "title": "As It Was",
        "artist": "Harry Styles",
        "album": "Harry's House",
        "genre": "Indie-pop",
        "year": 2022,
        "cover": "https://i.scdn.co/image/ab67616d0000b273b4695c5b9f71c4c1a797c276",
        "audio": "/api/stream?id=H5v3kku4y6Q",
        "color": "#3a1a00",
        "duration": "2:47",
        "durationSecs": 167
    },
    {
        "id": "a1yDcs95m84",
        "title": "Flowers",
        "artist": "Miley Cyrus",
        "album": "Endless Summer Vacation",
        "genre": "Pop",
        "year": 2023,
        "cover": "https://i.scdn.co/image/ab67616d0000b273f429549123d6a3f4ae29da60",
        "audio": "/api/stream?id=a1yDcs95m84",
        "color": "#3a2800",
        "duration": "3:20",
        "durationSecs": 200
    },
    {
        "id": "817P8W8-mGE",
        "title": "Perfect",
        "artist": "Ed Sheeran",
        "album": "÷ (Divide)",
        "genre": "Pop",
        "year": 2017,
        "cover": "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b83884b268a0c5c",
        "audio": "/api/stream?id=817P8W8-mGE",
        "color": "#0a0a20",
        "duration": "4:23",
        "durationSecs": 263
    },
    {
        "id": "0zGcUoRlhmw",
        "title": "Closer",
        "artist": "The Chainsmokers ft. Halsey",
        "album": "Collage",
        "genre": "EDM/Pop",
        "year": 2016,
        "cover": "https://i.scdn.co/image/ab67616d0000b2732ce2ab8b49e29a997abf064b",
        "audio": "/api/stream?id=0zGcUoRlhmw",
        "color": "#2e1800",
        "duration": "4:05",
        "durationSecs": 245
    },
    {
        "id": "DyDfgMOUHC8",
        "title": "Bad Guy",
        "artist": "Billie Eilish",
        "album": "When We All Fall Asleep, Where Do We Go?",
        "genre": "Electropop",
        "year": 2019,
        "cover": "https://i.scdn.co/image/ab67616d0000b27350aae1c3905cfaf57b1f558a",
        "audio": "/api/stream?id=DyDfgMOUHC8",
        "color": "#003030",
        "duration": "3:14",
        "durationSecs": 194
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
