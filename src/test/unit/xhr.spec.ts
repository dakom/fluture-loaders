import {Future} from "fluture";
import {loadXhr, XhrLoaderRequestDataType} from "../../lib/Lib";
import {S,Maybe,Either} from "../../lib/external/sanctuary/Sanctuary";

const TIMEOUT = 30000;

test('Xhr', (done) => {
  loadXhr ("http://httpbin.org/get") ({ 
      args: {
        hello: "world"
      }
    })
    .finally(Future.of(done).map(fn => fn()))
    .fork(
      console.error,
      xhr => expect(xhr.response.args.hello).toBe("world")
    )
    
    

}, TIMEOUT);