import _ from 'lodash'
import { ImgData, structureType } from './editor.type'

export class ImageEditor {
  imgData: ImgData;
  width: ImgData["width"];
  height: ImgData["width"];
  data: ImgData["data"];
  structure: structureType;

  constructor(imgData: ImgData, structure: structureType){
    this.imgData = imgData;
    this.width = imgData.width;
    this.height = imgData.height;
    this.data = _.cloneDeep(imgData.data);
    this.structure = structure;
  }

  
}
