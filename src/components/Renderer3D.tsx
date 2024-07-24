import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mesh, PlaneGeometry } from "three";
import { Canvas, ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { StateType } from "../store/store.type";
import { useSelector } from "react-redux";
import { OrbitControls } from '@react-three/drei'

function terrainHeightMap(imageData: ImageData){
  const width = imageData.width;
  const height = imageData.height;
  const geometry = new PlaneGeometry(width, height, width - 1, height - 1);

  for (let i = 0;  i < geometry.attributes.position.count; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    const pixelIndex = (y * width + x) * 4;
    const heightValue = imageData.data[pixelIndex] / 255 * 10; // 높이 값을 0에서 10 사이로 정규화
    // const heightValue: number = 30;
    geometry.attributes.position.setZ(i, -heightValue);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function Map(props: ThreeElements["mesh"]) {
  const imgData = useSelector((state: StateType) => state.imgData);
  const meshRef = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    // meshRef.current.rotation.x += delta;
    // meshRef.current.rotation.y += delta;
  });

  const terrain = useMemo(() => terrainHeightMap(imgData), [imgData]);

  return (
    <mesh
      ref={meshRef}
      geometry={terrain}
    >
      {/* <planeGeometry ref={planeRef} args={[width, height]} /> */}
      <meshStandardMaterial color={0xeeeeee} wireframe={false} />
    </mesh>
  );
}

function CameraController(){
  const {camera} = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 300);
    camera.lookAt(0,0,0)
  }, [camera])
  return null;
}

function MapRenderer() {  
  return (
    <Canvas>
      <CameraController />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Map position={[0, 0, 0]} />
      <OrbitControls />
    </Canvas>
  );
}

export default React.memo(MapRenderer);
