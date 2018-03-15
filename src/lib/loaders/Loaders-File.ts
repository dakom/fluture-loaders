import { Future } from 'fluture';

const _FileLoader = <T>(read:((reader:FileReader) => void)) => (blob:Blob): Future<ErrorEvent, T> => Future((reject, resolve) => {
  const fileReader = new FileReader();

  fileReader.onload = () => resolve(fileReader.result);
  fileReader.onerror = reject;

  read(fileReader);

  return fileReader.abort;
});

export const FileLoader = {
  ArrayBuffer: _FileLoader<ArrayBuffer> (fileReader => fileReader.readAsArrayBuffer),
  DataUrl: _FileLoader<string> (fileReader => fileReader.readAsDataURL), 
  Text: _FileLoader<string> (fileReader => fileReader.readAsText), 
};
