from fastapi import FastAPI, Query
from fastapi.responses import FileResponse
import yt_dlp
import os

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)  

@app.get("/download/")
async def download_video(url: str, format: str = Query("video")):
    try:
        
        ydl_opts = {
            'format': 'bestaudio/best' if format == "audio" else 'best',
            'outtmpl': f"{DOWNLOAD_FOLDER}/%(title)s.%(ext)s"
        }
        
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)

            
            if format == "audio":
                filename = filename.rsplit(".", 1)[0] + ".mp3"

        
        return FileResponse(filename, media_type="application/octet-stream", filename=os.path.basename(filename))

    except Exception as e:
        return {"error": str(e)}
