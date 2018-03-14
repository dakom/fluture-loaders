import {S, Maybe, Either} from "../external/sanctuary/Sanctuary";
import {sameOrigin, isNil} from "../utils/Utils";
import {Future} from "fluture";

export const loadImageUrlCrossOrigin = (crossOrigin: Maybe<"anonymous" | "use-credentials">) => (url:string): Future<ErrorEvent, HTMLImageElement> => Future((reject, resolve) => {
    const img = new Image();
    
    img.addEventListener("load", () => resolve(img));
    
    img.addEventListener("error", reject);

    S.map(x => img.crossOrigin = x) (crossOrigin);

    img.src = url;
});

export const loadImageUrl = (url:string): Future<Event, HTMLImageElement> =>
    loadImageUrlCrossOrigin(!sameOrigin(url) ? S.Just("anonymous") : S.Nothing) (url);


export const loadImageData = ({data, mimeType}:{data:ArrayBuffer,mimeType:string}): Future<ErrorEvent, HTMLImageElement> => Future((reject, resolve) => {
    const img = new Image();
    
    img.addEventListener("load", () => resolve(img));
    
    img.addEventListener("error", reject);

    const arrayBufferView = new Uint8Array( data );
    const blob = new Blob( [ arrayBufferView ], { type: mimeType} );
    const urlCreator = window.URL || (window as any).webkitURL;
    img.src = urlCreator.createObjectURL( blob );
});