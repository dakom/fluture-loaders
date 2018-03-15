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

No docs yet, so for now it's robably easiest just to look at [the loaders](src/lib/loaders) directly :)

The easiest way for most use cases is to use the `Fletch` or `FletchUrl` helpers:

```
Fletch.Json("http://httpbin.org/get") ({ 
    args: { hello: "world" }
})
.fork(
    console.error,
    ({args}) => expect(args.hello).toBe("world")
)
```
