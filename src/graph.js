import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { fitness, runPso } from "./pso";

// Scene and renderer set up
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
scene.background = new THREE.Color("black");
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Camera and light settings
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = 25;
camera.position.y = 25;
camera.position.z = 25;

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Graph axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// GUI for providing inputs to PSO
const gui = new GUI();
const guiNode = {
  populationSize: 100,
  maxIterations: 25,
  weight: 1,
  cPersonal: 1.5,
  cGlobal: 1.5,
  inertialDecrement: 0.3,
  earlyStop: false,
};

gui.add(guiNode, "populationSize", 10, 1000).step(1);
gui.add(guiNode, "maxIterations", 1, 50).step(1);
gui.add(guiNode, "weight", 0, 3).step(0.1);
gui.add(guiNode, "cPersonal", 0.5, 2.5).step(0.1);
gui.add(guiNode, "cGlobal", 0.5, 2.5).step(0.1);
gui.add(guiNode, "inertialDecrement", 0.1, 0.9).step(0.1);
gui.add(guiNode, "earlyStop");

gui.open();

// Geometry of function to minimize
const shapeDefinition = function (v, u, target) {
  const x = u * 5;
  const y = v * 5;
  const z = fitness(x, y) / 5;

  target.set(y, z, x); // flipping axes to visualize better since default is z perp to screen
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
let currentPositions;
let result;
const sphereMap = {};

export const startSimulation = () => {
  if (!result) {
    result = runPso(
      guiNode.populationSize,
      guiNode.maxIterations,
      guiNode.weight,
      guiNode.cPersonal,
      guiNode.cGlobal,
      guiNode.inertialDecrement,
      guiNode.earlyStop
    );
    currentPositions = result.next().value;

    for (let i = 0; i < currentPositions.length; i++) {
      const sphereGeom = new THREE.SphereGeometry(0.04, 20, 20);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMaterial);
      sphere.position.x = currentPositions[i][1];
      sphere.position.y = fitness(
        currentPositions[i][0],
        currentPositions[i][1]
      );
      sphere.position.z = currentPositions[i][0];
      sphereMap[sphere.uuid] = sphere;

      scene.add(sphere);
    }

    // Call generator to get next optimization iteration result
    setInterval(() => {
      // generator returns undefined when function completes
      if (result !== undefined) {
        currentPositions = result.next().value;
      }
    }, 1000);
  }
};

// Animation
(function animate() {
  if (currentPositions) {
    Object.keys(sphereMap).forEach((sphere, i) => {
      const newLocation = new THREE.Vector3(
        currentPositions[i][1],
        fitness(currentPositions[i][0], currentPositions[i][1]) / 5,
        currentPositions[i][0]
      );
      sphereMap[sphere].position.lerp(newLocation, 0.03);
    });
  }

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
})();
