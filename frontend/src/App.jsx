import { useState } from "react";
import { Input } from "./components/input";
import { Button } from "./components/button";
import { Card, CardContent } from "./components/card";
import { Download } from "lucide-react";

export default function YouTubeDownloader() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("video");
  const [downloadlink, setLink] = useState('');

  const handleDownload = async () => {
    if (!url.trim()) {
      alert("Please enter a valid YouTube URL.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/download/?url=${encodeURIComponent(url)}&format=${format}`
      );
  
      if (!response.ok) throw new Error("Failed to download");
  
      // Get filename from response headers
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]
        : `${format === "audio" ? "audio.mp3" : "video.mp4"}`;
  
      // Convert response to blob
      const blob = await response.blob();
      setLink(blob)
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error downloading file. Please try again.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl bg-white">
        <CardContent className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold text-center">Download from YouTube</h1>
          <Input 
            type="text" 
            placeholder="Enter YouTube URL..." 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="flex justify-between">
            <Button onClick={() => setFormat("video")} className={format === "video" ? "bg-blue-500 text-white" : "bg-gray-200"}>Video</Button>
            <Button onClick={() => setFormat("audio")} className={format === "audio" ? "bg-blue-500 text-white" : "bg-gray-200"}>Audio</Button>
          </div>
          <Button onClick={handleDownload} className="w-full flex items-center gap-2">
            <Download size={18} /> Download {format === "audio" ? "Audio" : "Video"}
          </Button>
          <a href={downloadlink || '#'}>link</a>
        </CardContent>
      </Card>
    </div>
  );
}
