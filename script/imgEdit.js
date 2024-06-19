import { render3d } from "./main.js";

const imgElement = document.querySelector("img#imageSrc");
const inputElement = document.getElementById("fileInput");
export var newImgData = [];

const options = {
  maxSizeMB: 1, // (default: Number.POSITIVE_INFINITY)
  maxWidthOrHeight: 360, // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
  // but, automatically reduce the size to smaller than the maximum Canvas size supported by each browser.
  // Please check the Caveat part for details.
  onProgress: Function, // optional, a function takes one progress argument (percentage from 0 to 100)
  useWebWorker: true, // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
  fileType: "image/*", // optional, fileType override e.g., 'image/jpeg', 'image/png' (default: file.type)
  alwaysKeepResolution: true, // optional, only reduce quality, always keep width and height (default: false)
};

document.addEventListener("DOMContentLoaded", async () => {
  let previewBlob = await fetch("/public/map.jpeg").then((res) => res.blob());
  imageCompression(previewBlob, options).then(
    (res) => (imgElement.src = URL.createObjectURL(res)),
  );
});

// 이미지 넣기
inputElement.addEventListener(
  "change",
  (e) => {
    console.log(e.target.files[0]);
    imageCompression(e.target.files[0], options).then(
      (res) => (imgElement.src = URL.createObjectURL(res)),
    );
  },
  false,
);

const rangeElement = document.querySelector("input#colorRange");

var baseColor = document.querySelector("input#colorRange").value;

rangeElement.addEventListener("change", () => {
  baseColor = rangeElement.value;
  drawCanvas();
});

function drawCanvas() {
  // canvas에 사진 그리기
  const canvasOutput = document.querySelector("canvas#canvasOutput");
  const ctx = canvasOutput.getContext("2d");
  canvasOutput.width = imgElement.width;
  canvasOutput.height = imgElement.height;
  ctx.drawImage(imgElement, 0, 0);

  //canvas에서 이미지 데이터 가져오기
  const imgData = ctx.getImageData(
    0,
    0,
    canvasOutput.width,
    canvasOutput.height,
  );

  //이미지 편집하기
  const editedData = editImg({
    ...imgData,
    width: imgData.width,
    height: imgData.height,
  });
  newImgData = new ImageData(
    new Uint8ClampedArray([...editedData.data]),
    editedData.width,
    editedData.height,
  );
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

  render3d(newImgData);
}

//canvas
imgElement.onload = function () {
  drawCanvas();
};

// 이미지 편집
function editImg(imgData) {
  const averaged = averageEdit(imgData);
  const greyscaled = greyScale(averaged);
  const binarizated = binarization(greyscaled);
  const morph = new Morph(binarizated, {
    data: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    width: 3,
    center: [1, 1],
  });
  return (
    morph
      // .dilation()
      // .erosion()
      .closing()
      // .grediant()
      .getImg()
  );
  // return morph.dilation()
  // return morph.erosion();
  // return binarizated
}

// 이미지 테두리 찾기

// 그림의 평균 값을 찾아, 평균보다 큰 값은 모두 255로 변경
function averageEdit(imgData) {
  const data = [...imgData.data];
  let average = { r: 0, g: 0, b: 0 };
  let total = 0;
  for (let i = 0; i < data.length; i = i + 4) {
    if (!(data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255)) {
      average.r += data[i];
      average.g += data[i + 1];
      average.b += data[i + 2];
      total++;
    }
  }

  average.r = Math.round(average.r / total);
  average.g = Math.round(average.g / total);
  average.b = Math.round(average.b / total);

  for (let i = 0; i < data.length; i = i + 4) {
    if (
      data[i] > average.r ||
      data[i + 1] > average.g ||
      data[i + 2] > average.b
    ) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }

  return new ImageData(
    new Uint8ClampedArray([...data]),
    imgData.width,
    imgData.height,
  );
}
// 이진화
function binarization(imgData, threshold = baseColor) {
  const data = [...imgData.data];
  for (let i = 0; i < data.length; i += 4) {
    if (
      data[i] < threshold &&
      data[i + 1] < threshold &&
      data[i + 2] < threshold
    ) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    } else {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }
  return new ImageData(
    new Uint8ClampedArray([...data]),
    imgData.width,
    imgData.height,
  );
}

function greyScale(imgData) {
  const data = [...imgData.data];

  for (let i = 0; i < data.length; i = i + 4) {
    const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = average;
    data[i + 1] = average;
    data[i + 2] = average;
  }

  return new ImageData(
    new Uint8ClampedArray([...data]),
    imgData.width,
    imgData.height,
  );
}

function middleEdit(imgData) {
  const data = [...imgData.data];
  const normalData = { r: {}, g: {}, b: {}, totalLength: 0 };
  const normal = { r: 0, g: 0, b: 0 };

  for (let i = 0; i < data.length; i = i + 4) {
    if (!(data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255)) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      normalData.r[r] ? normalData.r[r]++ : (normalData.r[r] = 1);
      normalData.g[g] ? normalData.g[g]++ : (normalData.g[g] = 1);
      normalData.b[b] ? normalData.b[b]++ : (normalData.b[b] = 1);
      normalData.totalLength++;
    }
  }

  for (let i = 0; i < 3; i++) {
    const color = Object.keys(normalData)[i];
    let mid = parseInt(normalData.totalLength / 2);
    for (let j of Object.keys(normalData[color])) {
      const colorNum = normalData[color][j];
      if (mid - colorNum <= 0) {
        normal[color] = j;
        break;
      } else {
        mid -= colorNum;
      }
    }
  }

  for (let i = 0; i < data.length; i = i + 4) {
    if (
      data[i] > normal.r ||
      data[i + 1] > normal.g ||
      data[i + 2] > normal.b
    ) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }

  return new ImageData(
    new Uint8ClampedArray([...data]),
    imgData.width,
    imgData.height,
  );
}

class Morph {
  constructor(imgData, structure) {
    /**
     * imgData : 이미지 데이터
     * structure : 구조화 요소 데이터
     * {
     *    data: [
     *             0,1,0,
     *             1,1,1,
     *             0,1,0
     *          ],
     *    width: 3,
     *    center: [1,1]
     * }
     */
    this.imgData = imgData;
    this.width = imgData.width;
    this.data = [...imgData.data];
    this.structure = structure;
    this.base = (this.structure.length - 1) / 3;
  }

  erosion(structureData) {
    /**
     * 1. 데이터 확인은 기존
     * 2. 데이터 편집은 복사본
     * 3. 기존 = 복사본
     */
    if (structureData) {
      this.structure = structureData;
    }

    const data = [...this.data];

    for (let i = 0; i < this.data.length; i = i + 4) {
      const data_x = parseInt(i % (this.width * 4));
      const data_y = parseInt(i / (this.width * 4));

      // 구조체 검색 후, 전체 다 0 아닌 경우는 255 으로 변경하기
      let check = true;

      // 구조체 전체 검색하기
      for (let j = 0; j < this.structure.data.length; j++) {
        if (this.structure.data[j] === 1) {
          const structure_x =
            (j % this.structure.width) - this.structure.center[0];
          const structure_y =
            parseInt(j / this.structure.width) - this.structure.center[1];

          const pos_x = data_x + structure_x * 4;
          const pos_y = data_y + structure_y;

          const pos = pos_x + pos_y * this.width * 4;

          const pos_r = this.data[pos];
          const pos_g = this.data[pos + 1];
          const pos_b = this.data[pos + 2];

          if (!(pos_r === 0 && pos_g === 0 && pos_b === 0)) {
            check = false;
            break;
          }
        }
      }

      if (!check) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }

    this.data = data;

    return this;
  }

  dilation(structureData) {
    /**
     * 1. 데이터 확인은 기존
     * 2. 데이터 편집은 복사본
     * 3. 기존 = 복사본
     */
    // if (structureData){
    //   this.structure = structureData;
    // }

    const data = [...this.data];

    for (let i = 0; i < this.data.length; i = i + 4) {
      const data_x = parseInt(i % (this.width * 4));
      const data_y = parseInt(i / (this.width * 4));

      // 구조체 검색 후, 전체 다 0 아닌 경우는 255 으로 변경하기
      let check = false;

      // 구조체 전체 검색하기
      for (let j = 0; j < this.structure.data.length; j++) {
        if (this.structure.data[j] === 1) {
          const structure_x =
            (j % this.structure.width) - this.structure.center[0];
          const structure_y =
            parseInt(j / this.structure.width) - this.structure.center[1];

          const pos_x = data_x + structure_x * 4;
          const pos_y = data_y + structure_y;

          const pos = pos_x + pos_y * this.width * 4;

          const pos_r = this.data[pos];
          const pos_g = this.data[pos + 1];
          const pos_b = this.data[pos + 2];

          if (pos_r === 0 && pos_g === 0 && pos_b === 0) {
            check = true;
            break;
          }
        }
      }

      if (check) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
    }

    this.data = data;

    return this;
  }

  grediant() {
    const erosionData = [...this.data];
    const dilationData = [...this.data];

    for (let i = 0; i < this.data.length; i = i + 4) {
      const data_x = parseInt(i % (this.width * 4));
      const data_y = parseInt(i / (this.width * 4));

      let erosionCheck = true;
      let dilationCheck = false;

      for (let j = 0; j < this.structure.data.length; j++) {
        if (this.structure.data[j] === 1) {
          const structure_x =
            (j % this.structure.width) - this.structure.center[0];
          const structure_y =
            parseInt(j / this.structure.width) - this.structure.center[1];

          const pos_x = data_x + structure_x * 4;
          const pos_y = data_y + structure_y;

          const pos = pos_x + pos_y * this.width * 4;

          const pos_r = this.data[pos];
          const pos_g = this.data[pos + 1];
          const pos_b = this.data[pos + 2];

          if (!(pos_r === 0 && pos_g === 0 && pos_b === 0)) {
            erosionCheck = false;
          }

          if (pos_r === 0 && pos_g === 0 && pos_b === 0) {
            dilationCheck = true;
          }
        }
      }

      if (!erosionCheck) {
        erosionData[i] = 255;
        erosionData[i + 1] = 255;
        erosionData[i + 2] = 255;
      }

      if (dilationCheck) {
        dilationData[i] = 0;
        dilationData[i + 1] = 0;
        dilationData[i + 2] = 0;
      }
    }

    const data = [];

    for (let i = 0; i < erosionData.length; i++) {
      if (erosionData[i] === dilationData[i]) {
        data[i] = 255;
      } else {
        data[i] = 0;
      }
    }

    this.data = data;

    return this;
  }

  opening() {
    this.erosion().dilation();
    return this;
  }

  closing() {
    this.dilation().erosion();
    return this;
  }

  getImg() {
    return new ImageData(
      new Uint8ClampedArray(this.data),
      this.imgData.width,
      this.imgData.height,
    );
  }
}
