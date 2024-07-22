import React, { useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../store/imgData";
import { options } from "../utils/imageCompression.option";
import { ImgData } from "../utils/editor.type";
import { StateType } from "../store/store.type";

function ImgPreview() {
  const dispatch = useDispatch();
  const imgData = useSelector((state: StateType) => state.imgData)
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** 1. 이미지 데이터가 로드된 경우,  */
  useEffect(() => {
    if(canvasRef.current !== null && imgData){
      // console.log(canvasRef.current)
      // console.log(imgData)
      // drawCanvas(canvasRef.current, imgData)
    }
    console.log(imgData)
    console.log('hi')
  }, [imgData]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      imageCompression(e.target.files[0], options)
        .then((res: Blob | MediaSource) => {
          const imgUrl = URL.createObjectURL(res);
          const img = new Image();
          img.onload = () => {
            const {width, height} = img
            const offscreenCanvas = new OffscreenCanvas(img.width, img.height);
            const ctx = offscreenCanvas.getContext("2d");
            ctx!.drawImage(img, 0, 0);
            const imageDataArray = ctx!.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
            dispatch(setData({ width, height, imageDataArray}))
          };
          img.src = imgUrl;
        });
    }
    console.log(imgData)
  };

  const drawCanvas = (canvas: HTMLCanvasElement, image: CanvasImageSource) => {
    const ctx = canvas.getContext("2d");
    if (ctx === null) return;
    ctx.drawImage(image, 0, 0);
  };

  return (
    <div>
      <div className="caption">
        image Preview
        <input ref={inputRef} onChange={handleInput} type="file" id="fileInput" name="file" />
      </div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default ImgPreview;
