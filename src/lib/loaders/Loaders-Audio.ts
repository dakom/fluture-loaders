import { Future, FutureInstance } from 'fluture';

export const loadAudioBuffer = (ctx:AudioContext) => (data:ArrayBuffer): FutureInstance<DOMException, AudioBuffer> => Future((reject, resolve) => {
  ctx.decodeAudioData(data, resolve, reject);
})
