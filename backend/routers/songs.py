from fastapi import APIRouter, Query
from fastapi.responses import RedirectResponse
import yt_dlp

from services.song_service import get_all_songs, search_youtube_tracks

router = APIRouter(prefix="/api")


@router.get("/songs")
def get_songs():
    return {
        "songs": get_all_songs(),
        "total": len(get_all_songs())
    }


@router.get("/search")
def search_songs(q: str = Query("")):
    results = search_youtube_tracks(q)
    return {
        "songs": results,
        "total": len(results)
    }


@router.get("/stream")
def stream_song(id: str = Query("")):
    if not id:
        return {"error": "Missing video ID"}

    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'nocheckcertificate': True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(id, download=False)
            audio_url = info.get('url')
            return RedirectResponse(url=audio_url)
        except Exception as e:
            return {"error": f"Failed to extract stream: {e}"}