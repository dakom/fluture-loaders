import { S, Either, Maybe } from "../../external/sanctuary/Sanctuary";
import { isNil } from "../../utils/Utils";
import { Future } from "fluture";

export interface XhrError {
    code: number;
    text: string;
}

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
}>

const makeQuery = (args: any): string => {
    let query = '';
    if (!isNil(args)) {
        for (var key in args) {
            if (args.hasOwnProperty(key)) {
                if (query !== '') {
                    query += '&';
                }
                query += `${key}=${encodeURIComponent(args[key])}`;
            }
        }
    }
    return query;
}
export const XhrLoader = (endpoint: string) => (options?: Partial<XhrLoaderOptions>): Future<XhrError, XMLHttpRequest> => Future((reject, resolve) => {
    const opts = { ...{ method: "GET" }, ...options };
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {

        if (xhr.readyState === xhr.DONE) {
            if (!xhr.status) {
                return; //was cancelled
            }

            if (xhr.status !== 200) {
                reject({ code: xhr.status, text: xhr.statusText });
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

    return xhr.abort;
});

