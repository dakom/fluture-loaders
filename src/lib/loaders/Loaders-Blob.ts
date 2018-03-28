import { Future } from 'fluture';

export const BlobLoader = <T>(read:(([FileReader,Blob]) => void)) => (blob:Blob): Future<ErrorEvent, T> => Future((reject, resolve) => {
  const fileReader = new FileReader();

  fileReader.onload = () => resolve(fileReader.result);
  fileReader.onerror = reject;
  
  read([fileReader, blob]);

  return () => fileReader.abort();
});

export const loadBlobAsArrayBuffer = BlobLoader<ArrayBuffer> (([fileReader, blob]) => fileReader.readAsArrayBuffer(blob));
export const loadBlobAsDataUrl = BlobLoader<string> (([fileReader, blob]) => fileReader.readAsDataURL(blob));
export const loadblobAsText = BlobLoader<string> (([fileReader, blob]) => fileReader.readAsText(blob));
