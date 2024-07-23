import React, { useEffect, useRef, useState } from "react";
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

  /** 이미지 데이터가 로드된 경우,  */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      /** image 크기 제한하기 (압축) */
      imageCompression(e.target.files[0], options)
        .then((res: Blob | MediaSource) => {
          const imgUrl = URL.createObjectURL(res);
          const img = new Image();
          img.onload = () => {
            /** canvas에 그리기 */
            const canvas = canvasRef.current;
            canvas!.width = img.width
            canvas!.height = img.height
            const ctx = canvas!.getContext("2d");
            ctx!.drawImage(img, 0, 0)
            /** canvas 데이터 redux에 전달하기 */
            const {width, height} = img
            const { data } = ctx!.getImageData(0, 0, canvas!.width, canvas!.height);
            const imageData = new ImageData(
              new Uint8ClampedArray([...data]),
              width, height
            )
            dispatch(setData(imageData))
          };
          img.src = imgUrl;
        });
    }
  };

  return (
    <div>
      <div className="caption">
        image Preview
        <input ref={inputRef} onChange={handleInput} type="file" id="fileInput" name="file" />
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default ImgPreview;
