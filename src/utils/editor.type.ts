type structureElement = 0 | 1;
export type structureType = structureElement[]

export interface ImgData {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray[];
}
