import {S, Maybe, Either} from "../external/sanctuary/Sanctuary";
import {isNil} from "../utils/Utils";
import {Future} from "fluture";

export const loadAudioBuffer = (ctx:AudioContext) => (data:ArrayBuffer): Future<DOMException, AudioBuffer> => Future((reject, resolve) => {
  ctx.decodeAudioData(data, resolve, reject);
})
