import {Future} from "fluture";
import {fetchJson} from "../../lib/Lib";
import {S,Maybe,Either} from "../../external/sanctuary/Sanctuary";

const TIMEOUT = 30000;

test('Xhr', (done) => {
  fetchJson("http://httpbin.org/get") ({ 
      data: {
        hello: "world"
      }
    })
    .finally(Future.of(done).map(fn => fn()))
    .fork(
      console.error,
      ({args}) => expect(args.hello).toBe("world")
    )

}, TIMEOUT);