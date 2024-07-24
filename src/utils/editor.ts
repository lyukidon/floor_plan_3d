import _ from "lodash";
import { ColorData, ColorKeys, ImgData, MiddleNormalDataType, MiddleNormalType, structureType } from "./editor.type";

export class ImageEditor {
  imgData: ImageData;
  width: ImageData["width"];
  height: ImageData["width"];
  data: number[];
  structure: structureType;

  constructor(imgData: ImageData, structure: structureType) {
    this.imgData = imgData;
    this.width = imgData.width;
    this.height = imgData.height;
    this.data = Array.from(_.cloneDeep(imgData.data))
    this.structure = structure;
  }

  average() {
    const data = _.cloneDeep(this.data);

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
      if (data[i] > average.r || data[i + 1] > average.g || data[i + 2] > average.b) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }
    this.data = data;
    return this;
  }

  binarization(threshold: number) {
    const data = _.cloneDeep(this.data)
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
    this.data = data;
    return this;
  }

  greyScale() {
    const data = _.cloneDeep(this.data);
    for (let i = 0; i < data.length; i = i + 4) {
      const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = average;
      data[i + 1] = average;
      data[i + 2] = average;
    }
    this.data = data;
    return this;
  }

  middle() {
    const data = _.cloneDeep(this.data);
    const normalData: MiddleNormalDataType = { r: {}, g: {}, b: {}, totalLength: 0 };
    const normal: MiddleNormalType = { r: 0, g: 0, b: 0 };
  
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
      const color: ColorKeys = Object.keys(normalData)[i] as ColorKeys;
      let mid:number = Math.floor(normalData.totalLength / 2)
      const colorData = normalData[color]
      for (let j of Object.keys(colorData)) {
        const colorNum = colorData[+j];
        if (mid - colorNum <= 0) {
          normal[color] = Math.floor(+j);
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
    this.data = data;
    return this;
  }

  erosion(structureData?: structureType) {
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
      const data_x = Math.floor(i % (this.width * 4));
      const data_y = Math.floor(i / (this.width * 4));

      // 구조체 검색 후, 전체 다 0 아닌 경우는 255 으로 변경하기
      let check = true;

      // 구조체 전체 검색하기
      for (let j = 0; j < this.structure.data.length; j++) {
        if (this.structure.data[j] === 1) {
          const structure_x =
            (j % this.structure.width) - this.structure.center[0];
          const structure_y =
            Math.floor(j / this.structure.width) - this.structure.center[1];

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

  dilation(structureData?: structureType) {
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
      const data_x = Math.floor(i % (this.width * 4));
      const data_y = Math.floor(i / (this.width * 4));

      // 구조체 검색 후, 전체 다 0 아닌 경우는 255 으로 변경하기
      let check = false;

      // 구조체 전체 검색하기
      for (let j = 0; j < this.structure.data.length; j++) {
        if (this.structure.data[j] === 1) {
          const structure_x =
            (j % this.structure.width) - this.structure.center[0];
          const structure_y =
            Math.floor(j / this.structure.width) - this.structure.center[1];

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
      const data_x = Math.floor(i % (this.width * 4));
      const data_y = Math.floor(i / (this.width * 4));

      let erosionCheck = true;
      let dilationCheck = false;

      for (let j = 0; j < this.structure.data.length; j++) {
        if (this.structure.data[j] === 1) {
          const structure_x =
            (j % this.structure.width) - this.structure.center[0];
          const structure_y =
            Math.floor(j / this.structure.width) - this.structure.center[1];

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
