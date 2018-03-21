[![Build Status](https://travis-ci.org/dakom/fluture-loaders.svg?branch=master)](https://travis-ci.org/dakom/fluture-loaders)

# Fluture loaders 

Wraps various loaders into [Fluture](https://github.com/fluture-js/Fluture) primitives.

Includes Xhr, as well as Audio, Blob, and Image helpers.

Typescript definitions are bundled in.

Some functions require the [Sanctuary](https://sanctuary.js.org) Maybe or Either monads.

# Installation

`npm install --save fluture-loaders`

# Status

Not battle-tested yet, API may change

# Usage

The easiest way for most use cases is to use the various fetch* helpers:

```
import {fetchJson} from "fluture-loaders"

fetchJson("http://httpbin.org/get") ({ 
    data: { hello: "world" }
})
.fork(
    console.error,
    ({args}) => expect(args.hello).toBe("world")
)
```

# API docs

General notes: 

1. If there is a function starting with a capital letter, and lowercase functions following, the lowercase are helpers that implement the capital but with more specific functionality and default values.

2. Crossorigin values are only those allowed by spec (e.g. "anonymous" or "use-credentials") and this _is_ enforced by the type system

## Audio

`loadAudioBuffer :: AudioContext -> ArrayBuffer -> Future DOMException AudioBuffer`

Loads an ArrayBuffer into an AudioBuffer via the supplied AudioContext

## Blob/File

`BlobLoader :: Generic T => (FileReader -> void) -> Blob -> Future ErrorEvent T`

Loads a Blob by calling the supplied function, which must accept a FileReader

`loadBlobAsArrayBuffer :: Blob -> Future ErrorEvent ArrayBuffer`

Loads a Blob into an ArrayBuffer

`loadBlobAsDataUrl :: Blob -> Future ErrorEvent String`

Loads a Blob into a DataUrl

`loadblobAsText :: Blob -> Future ErrorEvent String`

Loads a Blob into a text string

## Image

`ImageLoader :: {url: string, crossOrigin: Maybe string} -> Future ErrorEvent HTMLImageElement`

Loads an url into an HTMLImageElement. If crossOrigin is a Just then it will be set to the value.

`fetchImage :: string -> Future ErrorEvent HTMLImageElement`

Calls ImageLoader with automatically detected `crossOrigin` settings.
`loadImageFromURL` is an alias for `fetchImage`

`loadImageFromArrayBuffer :: {data:ArrayBuffer,mimeType:string} -> Future ErrorEvent HTMLImageElement`

Loads an ArrayBuffer into an HTMLImageElement. Mime type must be supplied.

## Video

`VideoPlayer :: {url:string, crossOrigin:Maybe string} -> Future ErrorEvent HTMLVideoElement`

Initializes a video and resolves when playback has started

`playVideo :: string -> Future ErrorEvent HTMLVideoElement`

Calls `VideoPlayer` with automatically detected `crossOrigin` settings.

## XHR/Fetch

`XhrLoader :: string -> XhrLoaderOptions -> Future XhrError XMLHttpRequest`

Loads an XHR request with the given options (see below)


`fletch :: Generic T => string -> XhrLoaderOptions -> Future XhrError T`

Generic XHR loader that returns the response of the request

`fetchUrl :: Generic T => string -> Future XhrError T`

Generic XHR loader that only uses an endpoint url and default options

### XHR helpers with options

`fetchArrayBuffer :: string -> XhrLoaderOptions -> Future XhrError ArrayBuffer`
Loads XHR request and returns the response as an ArrayBuffer

`fetchText :: string -> XhrLoaderOptions -> Future XhrError String`
Loads XHR request and returns the response as a string

`fetchBlob :: string -> XhrLoaderOptions -> Future XhrError Blob`
Loads XHR request and returns the response as a Blob

`fetchXML :: string -> XhrLoaderOptions -> Future XhrError XMLDocument`
Loads XHR request and returns the response as a XMLDocument (or Document)

`fetchJson :: string -> XhrLoaderOptions -> Future XhrError Object`
Loads XHR request and returns the response as an Object.
It will use `query` as the default requestType in this case (which may be overriden with the supplied options)

### XHR helpers with URL only

`fetchArrayBufferUrl :: string -> Future XhrError ArrayBuffer`
Loads XHR request and returns the response as an ArrayBuffer

`fetchTextUrl :: string -> Future XhrError String`
Loads XHR request and returns the response as a string

`fetchBlobUrl :: string -> Future XhrError Blob`
Loads XHR request and returns the response as a Blob

`fetchXMLUrl :: string -> Future XhrError XMLDocument`
Loads XHR request and returns the response as a XMLDocument (or Document)

`fetchJsonUrl :: string -> Future XhrError Object`
Loads XHR request and returns the response as an Object.

### XHR Additional Types

The following are the typescript definitions that comprise the options and returns from XHR loaders:

```
interface XhrError {
    code: number;
    text: string;
}

type XhrResponseType = "blob" | "arraybuffer" | "document" | "json" | "text";
type XhrMethod = "GET" | "POST" | "PUT" | "DELETE";
type XhrRequestType = "query" | "form" | "multipart";
type XhrLoaderOptions = Partial<{
    data: any;
    method: XhrMethod;
    responseType: XhrResponseType;
    requestType: XhrRequestType;
    withCredentials: boolean;
    headers: Array<[string, string]>;
}>
```

