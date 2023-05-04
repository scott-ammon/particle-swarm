import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { fitness, runPso } from "./pso";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: false });
// renderer.setClearColor(0xffffff, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera and Light Settings
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 25;
camera.position.x = 25;
camera.position.y = 25;

const controls = new OrbitControls(camera, renderer.domElement);

var light = new THREE.PointLight(0xffffff);
light.position.set(0, 0, 100);
scene.add(light);

// Graph Axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Geometry of function to minimize
const shapeDefinition = function (v, u, target) {
  const x = u * 5;
  const y = v * 5;
  const z = fitness(x, y) / 5;

  target.set(y, z, x);
};

const geometry = new ParametricGeometry(shapeDefinition, 100, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0x000000,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x1ce1f2 });
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
mesh.add(wireframe);

// Point Cloud
const result = runPso();
let currentPositions = result.next().value;

const sphereMap = {};
for (let i = 0; i < currentPositions.length; i++) {
  const sphereGeom = new THREE.SphereGeometry(0.04, 20, 20);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sphere = new THREE.Mesh(sphereGeom, sphereMaterial);
  sphere.position.y = currentPositions[i][0];
  sphere.position.z = currentPositions[i][1];
  sphere.position.x = fitness(currentPositions[i][0], currentPositions[i][1]);
  sphereMap[sphere.uuid] = sphere;

  scene.add(sphere);
}

setInterval(() => {
  currentPositions = result.next().value;
}, 500);

// Animation
(function animate() {
  if (currentPositions) {
    Object.keys(sphereMap).forEach((sphere, i) => {
      const newLocation = new THREE.Vector3(
        currentPositions[i][1],
        fitness(currentPositions[i][0], currentPositions[i][1]) / 5,
        currentPositions[i][0]
      );
      sphereMap[sphere].position.lerp(newLocation, 0.1);
    });
  }

  requestAnimationFrame(animate);
  controls.update();

  // mesh.rotation.y += increment;
  // axesHelper.rotation.y += increment;
  // pointCloud.rotation.y += increment;
  renderer.render(scene, camera);
})();
