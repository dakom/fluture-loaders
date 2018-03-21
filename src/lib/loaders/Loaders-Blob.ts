import { Future } from 'fluture';

export const BlobLoader = <T>(read:((reader:FileReader) => void)) => (blob:Blob): Future<ErrorEvent, T> => Future((reject, resolve) => {
  const fileReader = new FileReader();

  fileReader.onload = () => resolve(fileReader.result);
  fileReader.onerror = reject;

  read(fileReader);

  return () => fileReader.abort();
});

export const loadBlobAsArrayBuffer = BlobLoader<ArrayBuffer> (fileReader => fileReader.readAsArrayBuffer);
export const loadBlobAsDataUrl = BlobLoader<string> (fileReader => fileReader.readAsDataURL);
export const loadblobAsText = BlobLoader<string> (fileReader => fileReader.readAsText);
