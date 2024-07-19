type structureElement = 0 | 1;
export interface structureType {
  data: structureElement[];
  width: number;
  center: number[];
}

export interface ImgData {
  readonly width: number;
  readonly height: number;
  readonly data: number[];
}

export type ColorKeys = "r" | "g" | "b";

export type ColorData = {
  [key: string]: number;
};

export interface MiddleNormalDataType {
  r: ColorData;
  g: ColorData;
  b: ColorData;
  totalLength: number;
}

export interface MiddleNormalType {
  r: number;
  g: number;
  b: number;
}
