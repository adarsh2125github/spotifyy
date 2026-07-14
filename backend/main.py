from fastapi import FastAPI
from routers.songs import router as songs_router

app = FastAPI()

app.include_router(songs_router)

@app.get("/")
def home():
    return {"message": "Spotify Backend"}