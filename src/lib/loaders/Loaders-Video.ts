import { Future, FutureInstance} from 'fluture';
import { Maybe, S } from '../../external/sanctuary/Sanctuary';
import { sameOrigin, isNil } from "../../utils/Utils";

export const VideoPlayer = ({url, crossOrigin}:{url:string, crossOrigin:Maybe<"anonymous" | "use-credentials">}):FutureInstance<ErrorEvent, HTMLVideoElement> => Future((reject, resolve) => {
    let playing = false;
    let timeupdate = false;
  
    const video = document.createElement('video');
  
    video.autoplay = true;
    video.muted = true;
    video.loop = true;

    S.map(x => video.crossOrigin = x) (crossOrigin);
    
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


export const playVideo = (url:string) => VideoPlayer({ url, crossOrigin: !sameOrigin(url) ? S.Just("anonymous") : S.Nothing });
