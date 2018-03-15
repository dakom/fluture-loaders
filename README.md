[![Build Status](https://travis-ci.org/dakom/fluture-loaders.svg?branch=master)](https://travis-ci.org/dakom/fluture-loaders)

# Fluture loaders 

Wraps various loaders into [Fluture](https://github.com/fluture-js/Fluture) primitives.

Includes Xhr, as well as Audio, Blob, and Image helpers.

Typescript definitions are bundled in.

# Installation

`npm install --save fluture-loaders`

# Status

Not battle-tested yet, API may change

# Usage

No docs yet, so for now it's probably easiest just to look at [the source](src/lib) directly :)

The easiest way for most use cases is to use the `fetch*` or `fetchUrl*` [helpers](src/lib/helpers/Helpers.ts):

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
