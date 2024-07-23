import { ImgData } from "./editor.type";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function render3d(imgData: ImageData, renderer: THREE.WebGLRenderer) {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );

  const { data, width, height } = imgData;
  const planeGeometry = new THREE.PlaneGeometry(
    width,
    height,
    width - 1,
    height - 1,
  );

  const max_height = 30;

  for (let i = 0, l = planeGeometry.attributes.position.count; i < l; i++) {
    const x = i % width;
    const y = Math.floor(i / width);

    const index = (y * width + x) * 4;
    const brightness = data[index];

    const z = -(brightness / 255.0) * max_height;
    planeGeometry.attributes.position.setZ(i, z);
  }

  planeGeometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    wireframe: false,
  });

  const mesh = new THREE.Mesh(planeGeometry, material);
  scene.add(mesh);

  // 조명 설정
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 0, 50).normalize();
  scene.add(light);

  camera.position.z = 250;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.6; // 마우스로 카메라를 회전시킬 속도입니다. 기본값(Float)은 1입니다.
  controls.zoomSpeed = 0.6; // 마우스 휠로 카메라를 줌 시키는 속도 입니다. 기본값(Float)은 1입니다.
  // controls.panSpeed = 0.8; // 패닝 속도 입니다. 기본값(Float)은 1입니다.
  // controls.minDistance = 5; // 마우스 휠로 카메라 거리 조작시 최소 값. 기본값(Float)은 0 입니다.
  // controls.maxDistance = 100; // 마우스 휠로 카메라 거리 조작시 최대 값. 기본값(Float)은 무제한 입니다.
  controls.update();

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}