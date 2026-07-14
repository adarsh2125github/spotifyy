from fastapi import APIRouter
from fastapi.responses import FileResponse
from pathlib import Path

from services.song_service import get_all_songs, get_song_by_id

router = APIRouter()


@router.get("/songs")
def get_songs():
    return get_all_songs()


@router.get("/songs/{song_id}")
def get_song(song_id: int):
    song = get_song_by_id(song_id)

    if song:
        return song

    return {"message": "Song not found"}


@router.get("/stream/{song_name}")
def stream_song(song_name: str):
    file_path = Path("songs") / song_name

    if file_path.exists():
        return FileResponse(file_path, media_type="audio/mpeg")

    return {"message": "Song not found"}