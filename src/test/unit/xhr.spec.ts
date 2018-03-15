import {Future} from "fluture";
import {Fletch, FletchUrl} from "../../lib/Lib";
import {S,Maybe,Either} from "../../external/sanctuary/Sanctuary";

const TIMEOUT = 30000;

test('Xhr', (done) => {
  Fletch.Json("http://httpbin.org/get") ({ 
      args: {
        hello: "world"
      }
    })
    .finally(Future.of(done).map(fn => fn()))
    .fork(
      console.error,
      ({args}) => expect(args.hello).toBe("world")
    )

}, TIMEOUT);