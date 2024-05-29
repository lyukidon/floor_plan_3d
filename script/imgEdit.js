import { render3d } from "./main.js";

const imgElement = document.querySelector("img#imageSrc");
const inputElement = document.getElementById("fileInput");
export var newImgData = [];

const options = { 
  maxSizeMB: 1,            // (default: Number.POSITIVE_INFINITY)
  maxWidthOrHeight: 360,     // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
                                // but, automatically reduce the size to smaller than the maximum Canvas size supported by each browser.
                                // Please check the Caveat part for details.
  onProgress: Function,         // optional, a function takes one progress argument (percentage from 0 to 100) 
  useWebWorker: true,        // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
  fileType: "image/*",             // optional, fileType override e.g., 'image/jpeg', 'image/png' (default: file.type)
  alwaysKeepResolution: true // optional, only reduce quality, always keep width and height (default: false)
}

// 이미지 넣기
inputElement.addEventListener(
  "change",
  (e) => {
    imageCompression(e.target.files[0], options)
    .then(res => imgElement.src = URL.createObjectURL(res))
  },
  false
);

//canvas
imgElement.onload = function () {
  // canvas에 사진 그리기
  const canvasOutput = document.querySelector("canvas#canvasOutput");
  const ctx = canvasOutput.getContext("2d");
  canvasOutput.width = imgElement.width;
  canvasOutput.height = imgElement.height;
  ctx.drawImage(imgElement, 0, 0);

  // 이미지 편집
  function editImg(imgData) {
    const data = [...imgData.data];
    const baseColor = 40;
    for (var i = 0; i < data.length; i += 4) {
      if (data[i] < baseColor && data[i + 1] < baseColor && data[i + 2] < baseColor) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      } else {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }
    return { ...imgData, data };
  }

  //canvas에서 이미지 데이터 가져오기
  const imgData = ctx.getImageData(0, 0, canvasOutput.width, canvasOutput.height);
  const editedData = editImg({ ...imgData, width: imgData.width, height: imgData.height });
  newImgData = new ImageData(new Uint8ClampedArray([...editedData.data]), editedData.width, editedData.height)
  const canvasEdit = document.querySelector("canvas#canvasEdit");
  const ctxEdit = canvasEdit.getContext("2d");
  canvasEdit.width = imgElement.width;
  canvasEdit.height = imgElement.height;
  ctxEdit.putImageData(newImgData, 0, 0);

  // //canvas의 그림을 이미지화 하기
  // var base64URI = canvasOutput.toDataURL();
  // console.log(base64URI)
  // imgElement.src = base64URI;

  //canvas에서 이미지 데이터 가져오기
  
  render3d(newImgData)
};
