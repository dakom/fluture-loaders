import { S, Either, Maybe } from "../external/sanctuary/Sanctuary";
import { isNil } from "../utils/Utils";
import { Future } from "fluture";

export enum XhrLoaderResponseType {
    BLOB = "blob",
    ARRAYBUFFER = "arraybuffer",
    DOCUMENT = "document",
    JSON = "json",
    TEXT = "text",
}

export enum XhrLoaderRequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export enum XhrLoaderRequestDataType {
    NONE = "none",
    QUERY = "query",
    FORM = "form",
    MULTIPART = "multipart"
}

export interface XhrLoaderOptions {
    args: any;
    method: XhrLoaderRequestMethod;
    dataType: XhrLoaderRequestDataType;
    responseType: XhrLoaderResponseType;
    withCredentials?: boolean;
    headers?: Array<[string, string]>;
}

const defaultOptions = {
    args: null,
    method: XhrLoaderRequestMethod.GET,
    requestType: XhrLoaderRequestDataType.QUERY,
    responseType: XhrLoaderResponseType.JSON
}

const makeQuery = (args: any): string => {
    let query = '';

    for (var key in args) {
        if (args.hasOwnProperty(key)) {
            if (query !== '') {
                query += '&';
            }
            query += `${key}=${encodeURIComponent(args[key])}`;
        }
    }

    return query;
}
export const loadXhr = (endpoint: string) => (options?: Partial<XhrLoaderOptions>): Future<XMLHttpRequest, XMLHttpRequest> => Future((reject, resolve) => {
    const opts = { ...defaultOptions, ...options };
    const xhr = new XMLHttpRequest();

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

    const query = ((opts.requestType === XhrLoaderRequestDataType.FORM || opts.requestType === XhrLoaderRequestDataType.QUERY) && opts.args !== null)
        ? makeQuery(opts.args)
        : "";

    const url = (opts.requestType === XhrLoaderRequestDataType.QUERY && query !== "")
        ?   `${endpoint}?${query}`
        :   endpoint;
    
    xhr.open(opts.method,url);

    
    xhr.responseType = opts.responseType;

    if (opts.withCredentials !== undefined) {
        xhr.withCredentials = opts.withCredentials
    }

    if (opts.headers !== undefined) {
        opts.headers.forEach(([key, val]) => {
            xhr.setRequestHeader(key, val);
        });
    };

    if (opts.requestType === XhrLoaderRequestDataType.FORM && query !== "") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //Not actually allowed by spec, so commenting out.. browser will calculate automatically
        //xhr.setRequestHeader("Content-length", requestData.length);
        xhr.send(query);

    } else if(!isNil(opts.args)) {
        xhr.send(opts.args);
    } else {
        xhr.send();
    }

    return xhr.abort;
})
