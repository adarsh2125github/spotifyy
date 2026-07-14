import yt_dlp

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

def get_all_songs():
    return SONGS

def get_song_by_id(song_id: str):
    for song in SONGS:
        if song["id"] == song_id:
            return song
    return None

def search_youtube_tracks(query: str):
    results = []
    if not query:
        return results
        
    ydl_opts = {
        'format': 'bestaudio/best',
        'noplaylist': True,
        'quiet': True,
        'default_search': 'ytsearch',
        'nocheckcertificate': True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            search_results = ydl.extract_info(f"ytsearch10:{query}", download=False)
            if 'entries' in search_results:
                for entry in search_results['entries']:
                    results.append(map_youtube_entry(entry))
        except Exception as e:
            print(f"Error searching YouTube: {e}")
            
    return results