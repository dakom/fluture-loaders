import { Future, FutureInstance } from 'fluture';
import { sameOrigin, isNil } from "../../utils/Utils";

export const ImageLoader = ({url, crossOrigin}:{url:string, crossOrigin?: "anonymous" | "use-credentials"}): FutureInstance<ErrorEvent, HTMLImageElement> => Future((reject, resolve) => {
    const img = new Image();
    
    img.addEventListener("load", () => resolve(img));
    
    img.addEventListener("error", reject);

    if(crossOrigin) {
        img.crossOrigin = crossOrigin;
    }

    img.src = url;
});

export const fetchImage = (url: string) => 
    sameOrigin(url) ? ImageLoader({url}) : ImageLoader({url, crossOrigin: "anonymous"});

export const loadImageFromUrl = fetchImage; //an alias

export const loadImageFromArrayBuffer = ({data, mimeType}:{data:ArrayBuffer,mimeType:string}): FutureInstance<ErrorEvent, HTMLImageElement> => Future((reject, resolve) => {
    const img = new Image();
    
    img.addEventListener("load", () => resolve(img));
    
    img.addEventListener("error", reject);

    const arrayBufferView = new Uint8Array( data );
    const blob = new Blob( [ arrayBufferView ], { type: mimeType} );
    const urlCreator = window.URL || (window as any).webkitURL;
    img.src = urlCreator.createObjectURL( blob );
});
