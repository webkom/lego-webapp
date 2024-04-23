import FileSaver from 'file-saver';
import JsZip from 'jszip';

export const downloadFiles = (urls: string[]) =>
  Promise.all(
    urls.map(async (url) => await fetch(url).then((res) => res.blob())),
  );

export const zipFiles = async (
  zipTitle: string,
  fileNames: string[],
  blobs: Blob[],
) => {
  const zip = JsZip();
  blobs.forEach((blob, i) => {
    zip.file(fileNames[i], blob);
  });
  const zipFile = await zip.generateAsync({
    type: 'blob',
  });
  return FileSaver.saveAs(zipFile, `${zipTitle}.zip`);
};
