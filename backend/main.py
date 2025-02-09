from pytubefix import YouTube
import os
from fastapi import FastAPI
from fastapi.responses import FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
    "https://cxtube.vercel.app/",
    
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#Globlas

DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)  
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_PATH = os.path.join(BASE_DIR, "picture.jpg")
print(IMAGE_PATH)
@app.get("/")
async def fetch_videos():
    return {'msg': 'hello world'}

@app.get("/fetch/")
async def fetch_videos(url, format):
    yt = YouTube(url)
    data_to_send = yt.streams.filter(file_extension=format).fmt_streams
    return data_to_send

@app.get('/download/')
async def download_video(url:str, index:int):
    
    yt = YouTube(url,use_oauth=False,allow_oauth_cache=True)
    audio_stream = yt.streams.filter(only_audio=True).first()
    if yt:
        yt.streams[index].download(filename='video.mp4')
    if audio_stream:
        audio_stream.download(filename='audio.mp3')
    os.system('ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac video_converted.mp4')
    
    
    return FileResponse(os.path.join(BASE_DIR, 'video_converted.mp4'), filename='video_converted.mp4') 

@app.get('/getfile')
def download_file():
    return FileResponse(IMAGE_PATH, filename='picture.jpg')


