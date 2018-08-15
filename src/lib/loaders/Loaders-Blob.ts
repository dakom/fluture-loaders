import { FutureInstance, Future } from 'fluture';

export const BlobLoader = <T extends string | ArrayBuffer>(read:(([FileReader,Blob]) => void)) => (blob:Blob): FutureInstance<Event, T> => Future((reject, resolve) => {
  const fileReader = new FileReader();

  fileReader.onload = () => resolve(fileReader.result as T);
  fileReader.onerror = err => reject(err);
  
  read([fileReader, blob]);

  return () => fileReader.abort();
});

export const loadBlobAsArrayBuffer = BlobLoader<ArrayBuffer> (([fileReader, blob]) => fileReader.readAsArrayBuffer(blob));
export const loadBlobAsDataUrl = BlobLoader<string> (([fileReader, blob]) => fileReader.readAsDataURL(blob));
export const loadblobAsText = BlobLoader<string> (([fileReader, blob]) => fileReader.readAsText(blob));
