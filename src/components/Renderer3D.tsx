import React, { DetailedHTMLProps, HTMLAttributes, useEffect, useRef } from "react";
import * as THREE from "three";
import { render3d } from "../utils/render3d";
import { useSelector } from "react-redux";
import {StateType} from '../store/store.type'

function Renderer3D() {
  const imgData = useSelector((state: StateType) => state.imgData)
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current !== null){
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
      renderer.setClearColor(0xffffff, 1);
      containerRef.current.appendChild(renderer.domElement);

      // render3d(imgData, renderer);
    }
  }, []);

  return <div ref={containerRef}></div>;
}

export default React.memo(Renderer3D);
