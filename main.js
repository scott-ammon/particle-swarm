import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0xffffff, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* ---------- Camera and Light settings ---------- */
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 50;

new OrbitControls(camera, renderer.domElement);

var light = new THREE.PointLight(0xffffff);
light.position.set(0, 0, 100);
scene.add(light);

/* ----------------- Graph axes ----------------- */
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/* ------ Geometry of function to minimize ------ */
const shapeDefinition = function (v, u, target) {
  const x = u * 5;
  const y = v * 5;
  const z =
    (Math.pow(x - Math.PI, 2) +
      Math.pow(y - 2.72, 2) +
      Math.sin(3 * x + 1.41) +
      Math.sin(4 * y - 1.73)) /
    5;

  target.set(x, y, z);
};

const geometry = new ParametricGeometry(shapeDefinition, 100, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0x000000,
  side: THREE.DoubleSide
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
mesh.add(wireframe);

/* ------------- Population members ------------ */
const pointGeom = new THREE.SphereGeometry(0.05, 25, 25);
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const sphere = new THREE.Mesh(pointGeom, pointMaterial);
scene.add(sphere);
sphere.translateX(5);
sphere.translateY(3);
sphere.translateZ(4);

// const geometry = new THREE.BufferGeometry();
// new THREE.Vector3(0, 0, 0)
// const vertices = new Float32Array( [
// 	-1.0, -1.0,  1.0, // v0
// 	 1.0, -1.0,  1.0, // v1
// 	 1.0,  1.0,  1.0, // v2
// 	-1.0,  1.0,  1.0, // v3
// ] );

// const indices = [
// 	0, 1, 2,
// 	2, 3, 0,
// ];

// geometry.setIndex( indices );
// geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

/* ------------ Animation ------------ */
(function animate() {
  requestAnimationFrame(animate);
  // mesh.rotation.z += .01;
  // mesh.rotation.x += .01;
  renderer.render(scene, camera);
})();
