/*
    These helpers build upon the basic loaders to provide a simpler api 
*/

import {Future} from "fluture"
import {S, Maybe, Either} from "../../external/sanctuary/Sanctuary";
import {sameOrigin, isNil} from "../../utils/Utils";
import {ImageLoader} from "../loaders/Loaders-Image";
import {XhrError, XhrLoader, XhrResponseType, XhrLoaderOptions} from "../loaders/Loaders-Xhr";

const _XhrHelper = <T>(responseType:XhrResponseType) => (endpoint:string) => (options?:XhrLoaderOptions):Future<XhrError, T> =>
    XhrLoader(endpoint) ({...options, responseType})
        .map(xhr => xhr.response);

const _XhrUrlHelper = <T>(responseType:XhrResponseType) => (url:string):Future<XhrError, T> =>
    _XhrHelper <T>(responseType) (url) (null);

//Allows all Xhr options, but overrides the responseType and gives appropriate typings
export const Fletch = {
    ArrayBuffer: _XhrHelper<ArrayBuffer>("arraybuffer"),
    Text: _XhrHelper<string>("text"),
    Blob: _XhrHelper<Blob>("blob"),
    Xml: _XhrHelper<Document | XMLDocument>("document"),

    //Json will use query as default here since it's the typical case here (and can still be overridden)
    Json: (endpoint:string) => (options?:XhrLoaderOptions) => _XhrHelper<any>("json") (endpoint) ({requestType: "query", ...options}),
}

//Same but without any Xhr options (simple url get)
export const FletchUrl = {
    ArrayBuffer: _XhrUrlHelper<ArrayBuffer>("arraybuffer"),
    Json: _XhrUrlHelper<any>("json"),
    Text: _XhrUrlHelper<string>("text"),
    Blob: _XhrUrlHelper<Blob>("blob"),
    Xml: _XhrUrlHelper<Document | XMLDocument>("document"),
   
    //Image will auto-detect cross-origin settings
    Image: (url:string): Future<ErrorEvent, HTMLImageElement> => ImageLoader({url, crossOrigin: !sameOrigin(url) ? S.Just("anonymous") : S.Nothing}),
}