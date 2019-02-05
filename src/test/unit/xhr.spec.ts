import {Future, FutureInstance} from "fluture";
import {fetchJson} from "../../lib/Lib";

const TIMEOUT = 30000;

test('Xhr', (done) => {
  (fetchJson("http://httpbin.org/get") ({ 
      data: {
        hello: "world"
      }
    }) as FutureInstance<any, any>)
    .finally(Future.of(done).map(fn => fn()))
    .fork(
      console.error,
      ({args}) => expect(args.hello).toBe("world")
    )

}, TIMEOUT);
