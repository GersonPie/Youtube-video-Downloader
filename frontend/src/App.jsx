import { useEffect, useState } from "react";


export default function YouTubeDownloader() {
  const [url, setUrl] = useState('')
  const [format, setFormat] = useState('mp4')
  const [fileStreams, setFileStreams] = useState([])
  const [downalodlink, setDownloadLink] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(()=>{
    console.log(fileStreams)

  }, [fileStreams])

  const Convert_and_Download = async ()=>{
    const response = await fetch(`https://youtube-video-downloader-a6ha.onrender.com/download/?url=${url}&index=${index}`)
    console.log(response)
    var parsed_response = window.URL.createObjectURL(await response.blob())
    setDownloadLink(parsed_response)
  }

  const getFetch = async()=>{
    setFileStreams([])
    if(!url.trim()){
      alert('url invalido')
      return;
    }

    const response = await fetch(`https://youtube-video-downloader-a6ha.onrender.com/fetch/?url=${url}&format=${format}`)
    if(!response.ok){
      throw 'response from API is not ok'
    }
    else{
      
      const proto_streams = await response.json()
      setDownloadLink('')
      setFileStreams(proto_streams)
      
    }
  }
  return (
    <div className="app">
          
        <input type="url" onChange={(e)=>setUrl(e.target.value)} value={url} name="url" />
        <select name="format" id="" onChange={(e)=>setFormat(e.target.value)} value={format}>
            <option value="mp4">Video</option>
            <option value="mp3">Audio</option>
        </select>selected format: {format}
        <input type="submit" onClick={getFetch}/>

        {(fileStreams?.length>0 && fileStreams) && <select onChange={(e)=>setIndex(e.target.value)} name="" id="">
          <option value="#">Select your Video</option>
          {
            fileStreams.map((file, i)=>{
              
              if(file.resolution)
              return <option key={i} value={i}>
              {file._monostate.title} | 
              {file.resolution} |  
              {file._filesize_mb}mb</option>
            })
          }
        </select>}
        <input type="submit" value='convert' onClick={Convert_and_Download}/>
        index: {index} selected
        <br />
        {downalodlink && <a href={downalodlink} download>Baixar</a>}
        
    </div>
  );
}
