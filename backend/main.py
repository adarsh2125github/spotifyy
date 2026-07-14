from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.songs import router as songs_router

app = FastAPI()

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(songs_router)


@app.get("/")
def home():
    return {"message": "Spotify Backend"}