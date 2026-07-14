from http.server import BaseHTTPRequestHandler
import json

SONGS = [
    {
        "id": "fHI8X4OXluQ",
        "title": "Blinding Lights",
        "artist": "The Weeknd",
        "album": "After Hours",
        "genre": "Synth-pop",
        "year": 2020,
        "cover": "https://i.ytimg.com/vi/fHI8X4OXluQ/hqdefault.jpg",
        "audio": "/api/stream?id=fHI8X4OXluQ",
        "color": "#0d1b4b",
        "duration": "3:21",
        "durationSecs": 201
    },
    {
        "id": "JGwWNGJdvx8",
        "title": "Shape of You",
        "artist": "Ed Sheeran",
        "album": "÷ (Divide)",
        "genre": "Pop",
        "year": 2017,
        "cover": "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg",
        "audio": "/api/stream?id=JGwWNGJdvx8",
        "color": "#1a0a40",
        "duration": "3:53",
        "durationSecs": 233
    },
    {
        "id": "7wtfhZwyrcc",
        "title": "Believer",
        "artist": "Imagine Dragons",
        "album": "Evolve",
        "genre": "Alt-rock",
        "year": 2017,
        "cover": "https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg",
        "audio": "/api/stream?id=7wtfhZwyrcc",
        "color": "#0a2010",
        "duration": "3:24",
        "durationSecs": 204
    },
    {
        "id": "kTJczUoc26U",
        "title": "Stay",
        "artist": "The Kid LAROI & Justin Bieber",
        "album": "F*CK LOVE 3: OVER YOU",
        "genre": "Pop-rock",
        "year": 2021,
        "cover": "https://i.ytimg.com/vi/kTJczUoc26U/hqdefault.jpg",
        "audio": "/api/stream?id=kTJczUoc26U",
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
        "cover": "https://i.ytimg.com/vi/34Na4j8AVgA/hqdefault.jpg",
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
        "cover": "https://i.ytimg.com/vi/H5v3kku4y6Q/hqdefault.jpg",
        "audio": "/api/stream?id=H5v3kku4y6Q",
        "color": "#3a1a00",
        "duration": "2:47",
        "durationSecs": 167
    },
    {
        "id": "G7KNmW9a75Y",
        "title": "Flowers",
        "artist": "Miley Cyrus",
        "album": "Endless Summer Vacation",
        "genre": "Pop",
        "year": 2023,
        "cover": "https://i.ytimg.com/vi/G7KNmW9a75Y/hqdefault.jpg",
        "audio": "/api/stream?id=G7KNmW9a75Y",
        "color": "#3a2800",
        "duration": "3:20",
        "durationSecs": 200
    },
    {
        "id": "2Vv-BfVoq4g",
        "title": "Perfect",
        "artist": "Ed Sheeran",
        "album": "÷ (Divide)",
        "genre": "Pop",
        "year": 2017,
        "cover": "https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg",
        "audio": "/api/stream?id=2Vv-BfVoq4g",
        "color": "#0a0a20",
        "duration": "4:23",
        "durationSecs": 263
    },
    {
        "id": "0zGcUoRlpgY",
        "title": "Closer",
        "artist": "The Chainsmokers ft. Halsey",
        "album": "Collage",
        "genre": "EDM/Pop",
        "year": 2016,
        "cover": "https://i.ytimg.com/vi/0zGcUoRlpgY/hqdefault.jpg",
        "audio": "/api/stream?id=0zGcUoRlpgY",
        "color": "#2e1800",
        "duration": "4:05",
        "durationSecs": 245
    },
    {
        "id": "DyDfgMOUUA8",
        "title": "Bad Guy",
        "artist": "Billie Eilish",
        "album": "When We All Fall Asleep, Where Do We Go?",
        "genre": "Electropop",
        "year": 2019,
        "cover": "https://i.ytimg.com/vi/DyDfgMOUUA8/hqdefault.jpg",
        "audio": "/api/stream?id=DyDfgMOUUA8",
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
