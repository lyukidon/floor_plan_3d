import { Options } from "browser-image-compression";

export const options: Options = {
  maxSizeMB: 1, // (default: Number.POSITIVE_INFINITY)
  maxWidthOrHeight: 360, // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
  // but, automatically reduce the size to smaller than the maximum Canvas size supported by each browser.
  // Please check the Caveat part for details.
  // onProgress: Function, // optional, a function takes one progress argument (percentage from 0 to 100)
  useWebWorker: true, // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
  fileType: "image/*", // optional, fileType override e.g., 'image/jpeg', 'image/png' (default: file.type)
  alwaysKeepResolution: true, // optional, only reduce quality, always keep width and height (default: false)
};