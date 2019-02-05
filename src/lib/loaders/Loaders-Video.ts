import { Future, FutureInstance} from 'fluture';
import { sameOrigin, isNil } from "../../utils/Utils";

export const VideoPlayer = ({url, crossOrigin}:{url:string, crossOrigin?:"anonymous" | "use-credentials"}):FutureInstance<ErrorEvent, HTMLVideoElement> => Future((reject, resolve) => {
    let playing = false;
    let timeupdate = false;
  
    const video = document.createElement('video');
  
    video.autoplay = true;
    video.muted = true;
    video.loop = true;

    if(crossOrigin) {
        video.crossOrigin = crossOrigin;
    }
    
    const checkReady = () => {
      if (playing && timeupdate) {
        resolve(video);
      }
    }
  
    video.addEventListener('playing', () => {
       playing = true;
       checkReady();
    }, true);
  
    video.addEventListener('timeupdate', () => {
       timeupdate = true;
       checkReady();
    }, true);
  
    
    video.src = url;
    video.play();
  });


export const playVideo = (url:string) => 
    sameOrigin(url) ? VideoPlayer({url}) : VideoPlayer({url, crossOrigin: "anonymous"}); 
