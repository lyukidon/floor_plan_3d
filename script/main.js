import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth/2, window.innerHeight/2);
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement);

export function render3d(imgData) {

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(imgData.width / 2, imgData.height / 2, 400);
  // camera.lookAt(imgData.width/2, imgData.height/2,0);

  const scene = new THREE.Scene();

  const wallHeight = 15;

  //선 그리기
  const material = new THREE.LineBasicMaterial({ color: 0x495057 });

	const wallGroup = new THREE.Group();

  for (let i = 0; i < imgData.data.length; i++) {
    if (imgData.data[i] === 0 && imgData.data[i + 1] === 0 && imgData.data[i + 2]) {
      const x = parseInt(i / 4) % imgData.width;
      const y = parseInt(i / (imgData.width * 4));
      //벽 추가
      const points = [];
      points.push(new THREE.Vector3(x, -y, 0));
      points.push(new THREE.Vector3(x, -y, wallHeight));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      wallGroup.add(line);
    }
  }

	wallGroup.position.set(- imgData.width/2, imgData.height/2,0)
	scene.add(wallGroup)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.6; // 마우스로 카메라를 회전시킬 속도입니다. 기본값(Float)은 1입니다.
  controls.zoomSpeed = 0.6; // 마우스 휠로 카메라를 줌 시키는 속도 입니다. 기본값(Float)은 1입니다.
  // controls.panSpeed = 0.8; // 패닝 속도 입니다. 기본값(Float)은 1입니다.
  // controls.minDistance = 5; // 마우스 휠로 카메라 거리 조작시 최소 값. 기본값(Float)은 0 입니다.
  // controls.maxDistance = 100; // 마우스 휠로 카메라 거리 조작시 최대 값. 기본값(Float)은 무제한 입니다.
	controls.update();

  function animate() {
    requestAnimationFrame(animate);
		controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
