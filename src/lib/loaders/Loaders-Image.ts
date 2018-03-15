import { Future } from 'fluture';
import { Maybe, S } from '../../external/sanctuary/Sanctuary';

export const ImageLoader = ({url, crossOrigin}:{url:string, crossOrigin: Maybe<"anonymous" | "use-credentials">}): Future<ErrorEvent, HTMLImageElement> => Future((reject, resolve) => {
    const img = new Image();
    
    img.addEventListener("load", () => resolve(img));
    
    img.addEventListener("error", reject);

    S.map(x => img.crossOrigin = x) (crossOrigin);

    img.src = url;
});

export const ImageDataLoader = ({data, mimeType}:{data:ArrayBuffer,mimeType:string}): Future<ErrorEvent, HTMLImageElement> => Future((reject, resolve) => {
    const img = new Image();
    
    img.addEventListener("load", () => resolve(img));
    
    img.addEventListener("error", reject);

    const arrayBufferView = new Uint8Array( data );
    const blob = new Blob( [ arrayBufferView ], { type: mimeType} );
    const urlCreator = window.URL || (window as any).webkitURL;
    img.src = urlCreator.createObjectURL( blob );
});