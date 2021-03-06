import { isNil } from "../../utils/Utils";
import { Future, FutureInstance } from "fluture";


export type XhrResponseType = "blob" | "arraybuffer" | "document" | "json" | "text";
export type XhrMethod = "GET" | "POST" | "PUT" | "DELETE";
export type XhrRequestType = "query" | "form" | "multipart";
export type XhrLoaderOptions = Partial<{
    data: any;
    method: XhrMethod;
    responseType: XhrResponseType;
    requestType: XhrRequestType;
    withCredentials: boolean;
    headers: Array<[string, string]>;
    xhr:XMLHttpRequest;
}>

const makeQuery = (args: any): string => {
    let query = '';
    if (!isNil(args)) {
        for (var key in args) {
            if (args.hasOwnProperty(key) && !isNil(args[key])) {
                if (query !== '') {
                    query += '&';
                }
                query += `${key}=${encodeURIComponent(args[key])}`;
            }
        }
    }
    return query;
}
export const XhrLoader = (endpoint: string) => (options?: Partial<XhrLoaderOptions>): FutureInstance<XMLHttpRequest, XMLHttpRequest> => Future((reject, resolve) => {
    const opts = { ...{ method: "GET" }, ...options };
    const xhr = opts.xhr !== undefined
        ? opts.xhr 
        : new XMLHttpRequest();


    xhr.onreadystatechange = () => {

        if (xhr.readyState === xhr.DONE) {
            if (!xhr.status) {
                return; //was cancelled
            }

            if (xhr.status !== 200) {
                reject(xhr);
            } else {
                resolve(xhr);
            }
        }
    }

    const query = ((opts.requestType === "form" || opts.requestType === "query") && opts.data !== null)
        ? makeQuery(opts.data)
        : "";

    const url = (opts.requestType === "query" && query !== "")
        ? `${endpoint}?${query}`
        : endpoint;

    xhr.open(opts.method, url);


    xhr.responseType = opts.responseType;

    if (opts.withCredentials !== undefined) {
        xhr.withCredentials = opts.withCredentials
    }

    if (opts.headers !== undefined) {
        opts.headers.forEach(([key, val]) => {
            xhr.setRequestHeader(key, val);
        });
    };

    if (opts.requestType === "form" && query !== "") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //Not actually allowed by spec, so commenting out.. browser will calculate automatically
        //xhr.setRequestHeader("Content-length", requestData.length);
        xhr.send(query);

    } else if (!isNil(opts.data)) {
        xhr.send(opts.data);
    } else {
        xhr.send();
    }

    return () => xhr.abort();
});

//generics for simplifying fetch style requests
//The base function is "fletch" - but after that it's all "fetch*"
export const fletch = <T>(endpoint:string) => (options?: XhrLoaderOptions): FutureInstance<XMLHttpRequest, T> =>
    XhrLoader(endpoint)(options).map(xhr => xhr.response);

export const fetchUrl = <T>(endpoint:string): FutureInstance<XMLHttpRequest, T> =>
    fletch<T> (endpoint) (null);


//internal helpers to keep things DRY
const _fetchOverride = <T>(responseType: XhrResponseType) => (endpoint: string) => (options?: XhrLoaderOptions): FutureInstance<XMLHttpRequest, T> =>
    fletch<T> (endpoint) ({ ...options, responseType });

const _fetchUrlOverride = <T>(responseType: XhrResponseType) => (endpoint: string): FutureInstance<XMLHttpRequest, T> =>
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
