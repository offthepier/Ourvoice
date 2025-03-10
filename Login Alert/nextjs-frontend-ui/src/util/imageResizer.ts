import Resizer from "react-image-file-resizer";

const resizeProfilePicFile = (file: any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1000,
      1000,
      "WEBP",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

const resizeProfilePicThumbnail = (file: any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      170,
      170,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

export { resizeProfilePicFile, resizeProfilePicThumbnail };
