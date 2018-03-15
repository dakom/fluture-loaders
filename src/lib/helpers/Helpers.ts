/*
    These helpers build upon the basic loaders to provide a simpler api 
*/

import { Future } from "fluture"
import { S, Maybe, Either } from "../../external/sanctuary/Sanctuary";
import { sameOrigin, isNil } from "../../utils/Utils";
import { ImageLoader } from "../loaders/Loaders-Image";
import { XhrError, XhrLoader, XhrResponseType, XhrLoaderOptions } from "../loaders/Loaders-Xhr";

//generics for simplifying fetch style requests
export const fletch = <T>(responseType: XhrResponseType) => (endpoint: string) => (options?: XhrLoaderOptions): Future<XhrError, T> =>
    XhrLoader(endpoint)({ ...options, responseType })
        .map(xhr => xhr.response);

export const fletchUrl = <T>(responseType: XhrResponseType) => (url: string): Future<XhrError, T> =>
    fletch<T>(responseType)(url)(null);

//Allows all Xhr options, but overrides the responseType and gives appropriate typings
export const fetchArrayBuffer = fletch<ArrayBuffer>("arraybuffer");
export const fetchText = fletch<string>("text");
export const fetchBlob = fletch<Blob>("blob");
export const fetchXml = fletch<Document | XMLDocument>("document");
//Json will use query as default here since it's the typical case here (and can still be overridden)
export const fetchJson = (endpoint: string) => (options?: XhrLoaderOptions) => fletch<any>("json")(endpoint)({ requestType: "query", ...options });

//Same as fetch* but without any Xhr options (simple url get)
export const fetchArrayBufferFromUrl = fletchUrl<ArrayBuffer>("arraybuffer");
export const fetchJsonFromUrl = fletchUrl<any>("json");
export const fetchTextFromUrl = fletchUrl<string>("text");
export const fetchBlobFromUrl = fletchUrl<Blob>("blob");
export const fetchXmlFromUrl = fletchUrl<Document | XMLDocument>("document");
//Image will auto-detect cross-origin settings
export const fetchImageFromUrl = (url: string) => ImageLoader({ url, crossOrigin: !sameOrigin(url) ? S.Just("anonymous") : S.Nothing });
