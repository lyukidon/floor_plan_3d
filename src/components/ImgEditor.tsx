import React, { RefObject, useEffect, useRef, useState } from "react";
import { ImageEditor } from "../utils/editor";
import { StateType } from "../store/store.type";
import { useSelector } from "react-redux";
import { structureType } from "../utils/editor.type";

function ImgEditor() {
  const [threshold, setThreshold] = useState<number>(60);
  const rangeRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgData = useSelector((state: StateType) => state.imgData);
  const structure: structureType = { width: 3, center: [1, 1], data: [0, 1, 0, 1, 1, 1, 0, 1, 0] };

  const handleRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setThreshold(+value);
  };

  const editing = (): ImageData => {
    const imageEditor = new ImageEditor(imgData, structure);
    const editedData = imageEditor
                        .average()
                        .greyScale()
                        .binarization(threshold)
                        .closing()
                        .getImg();
    return editedData;
  };

  const drawCanvas = (canvasElement: RefObject<HTMLCanvasElement>, data: ImageData) => {
    const canvas = canvasRef.current;
    canvas!.width = data.width;
    canvas!.height = data.height;
    const ctx = canvas!.getContext("2d");
    ctx?.putImageData(data, 0, 0);
  }

  useEffect(() => {
    if (imgData.data.length !== 0) {
      const editedData = editing();
      drawCanvas(canvasRef, editedData)
    }
  }, [imgData, threshold]);

  return (
    <div>
      <input type="range" ref={rangeRef} onChange={handleRange} />
      <canvas className="resultCanvas" ref={canvasRef} />
    </div>
  );
}

export default ImgEditor;
