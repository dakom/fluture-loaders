import { Future, FutureInstance } from 'fluture';
import { Maybe, S } from '../../external/sanctuary/Sanctuary';
import { sameOrigin, isNil } from "../../utils/Utils";

export const ImageLoader = ({url, crossOrigin}:{url:string, crossOrigin: Maybe<"anonymous" | "use-credentials">}): FutureInstance<ErrorEvent, HTMLImageElement> => Future((reject, resolve) => {
    const img = new Image();
    
    img.addEventListener("load", () => resolve(img));
    
    img.addEventListener("error", reject);

    S.map(x => img.crossOrigin = x) (crossOrigin);

    img.src = url;
});

export const fetchImage = (url: string) => ImageLoader({ url, crossOrigin: !sameOrigin(url) ? S.Just("anonymous") : S.Nothing });
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
