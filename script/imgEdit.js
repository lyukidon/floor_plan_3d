// // OpenCV 모듈
// const Module = {
//   // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
//   onRuntimeInitialized() {
//     document.getElementById("status").innerHTML = "OpenCV.js is ready.";
//   },
// };

import { render3d } from "./main.js";
import { imgData } from "./mockData.js";

const imgElement = document.querySelector("img#imageSrc");
const inputElement = document.getElementById("fileInput");
export var newImgData = []

// 이미지 넣기
inputElement.addEventListener(
  "change",
  (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
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
