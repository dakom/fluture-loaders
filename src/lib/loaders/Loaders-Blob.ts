import {S, Maybe, Either} from "../external/sanctuary/Sanctuary";
import {isNil} from "../utils/Utils";
import {Future} from "fluture";

export const loadBlob = (blob:Blob): Future<ErrorEvent, ArrayBuffer> => Future((reject, resolve) => {
  const fileReader = new FileReader();

  fileReader.onload = () => resolve(fileReader.result);
  fileReader.onerror = reject;

  fileReader.readAsArrayBuffer(blob);

  return fileReader.abort;
});
