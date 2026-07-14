songs = [
    {
        "id": 1,
        "title": "Believer",
        "artist": "Imagine Dragons",
        "album": "Evolve",
        "duration": "3:24"
    },
    {
        "id": 2,
        "title": "Faded",
        "artist": "Alan Walker",
        "album": "Different World",
        "duration": "3:32"
    }
]

def get_all_songs():
    return songs


def get_song_by_id(song_id: int):
    for song in songs:
        if song["id"] == song_id:
            return song
    return None