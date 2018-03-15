/*
    These helpers build upon the basic loaders to provide a simpler api 
*/

import { Future } from "fluture"
import { S, Maybe, Either } from "../../external/sanctuary/Sanctuary";
import { sameOrigin, isNil } from "../../utils/Utils";
import { ImageLoader } from "../loaders/Loaders-Image";
import { XhrError, XhrLoader, XhrResponseType, XhrLoaderOptions } from "../loaders/Loaders-Xhr";

//generics for simplifying fetch style requests - uses the "fletch" 
//The base function is "fletch" - but after that it's all "fetch*"
export const fletch = <T>(endpoint:string) => (options?: XhrLoaderOptions): Future<XhrError, T> =>
    XhrLoader(endpoint)(options).map(xhr => xhr.response);

export const fetchUrl = <T>(endpoint:string): Future<XhrError, T> =>
    fletch<T> (endpoint) (null);


//internal helpers to keep things DRY
const _fetchOverride = <T>(responseType: XhrResponseType) => (endpoint: string) => (options?: XhrLoaderOptions): Future<XhrError, T> =>
    fletch<T> (endpoint) ({ ...options, responseType });

const _fetchUrlOverride = <T>(responseType: XhrResponseType) => (endpoint: string): Future<XhrError, T> =>
    fletch<T> (endpoint) ({responseType});

//Fetches the specific data. Overrides the responseType, but otherwise all Xhr settings are allowed
export const fetchArrayBuffer = _fetchOverride<ArrayBuffer>("arraybuffer");
export const fetchText = _fetchOverride<string>("text");
export const fetchBlob = _fetchOverride<Blob>("blob");
export const fetchXml = _fetchOverride<Document | XMLDocument>("document");

//Json will use query as default here since it's the typical case here (and can still be overridden)
export const fetchJson = (endpoint: string) => (options?: XhrLoaderOptions) => _fetchOverride<any>("json")(endpoint)({ requestType: "query", ...options });


//wrapper over fletch for cases it's just the url
//Same as fetch* but without any Xhr options (simple url get)
export const fetchArrayBufferUrl= _fetchUrlOverride<ArrayBuffer>("arraybuffer");
export const fetchJsonUrl = _fetchUrlOverride<any>("json");
export const fetchTextUrl = _fetchUrlOverride<string>("text");
export const fetchBlobUrl = _fetchUrlOverride<Blob>("blob");
export const fetchXmlUrl = _fetchUrlOverride<Document | XMLDocument>("document");


//Image is only url, but there is no Xhr case so it's just "fetchImage". Will auto-detect cross-origin settings
export const fetchImage = (url: string) => ImageLoader({ url, crossOrigin: !sameOrigin(url) ? S.Just("anonymous") : S.Nothing });
