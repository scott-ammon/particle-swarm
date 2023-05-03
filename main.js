import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

const scene = new THREE.Scene();
const clock = new THREE.Clock();
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
  const z = u * 5;
  const x = v * 5;
  const y =
    (Math.pow(z - Math.PI, 2) +
      Math.pow(x - 2.72, 2) +
      Math.sin(3 * z + 1.41) +
      Math.sin(4 * x - 1.73)) /
    5;

  target.set(x, y, z);
};

const geometry = new ParametricGeometry(shapeDefinition, 100, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0x000000,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
mesh.add(wireframe);

// Point Cloud
const numPoints = 100;
// const sizes = [];
// const vertices = [];

// for (let i = 0; i < numPoints; i++) {
//   const x = Math.random() * 5;
//   const y = Math.random() * 5;
//   const z = Math.random() * 5;
//   vertices.push(x, y, z);
//   sizes[i] = 2;
// }

// const circle = new THREE.TextureLoader().load("assets/circle.png");
// circle.colorSpace = THREE.SRGBColorSpace;
// const pointsMaterial = new THREE.PointsMaterial({
//   size: 0.5,
//   sizeAttenuation: true,
//   map: circle,
//   alphaTest: 0.5,
//   transparent: true,
// });
// pointsMaterial.color.setHSL(1.0, 0.8, 0.7, THREE.SRGBColorSpace);
// const pointsGeometry = new THREE.BufferGeometry();
// pointsGeometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
// pointsGeometry.setAttribute(
//   "position",
//   new THREE.Float32BufferAttribute(vertices, 3)
// );

// const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
// scene.add(pointCloud);

// Rotate view
const rotateRadians = (angle) => {
  return (angle * Math.PI) / 180;
};

// Alternate: Render point cloud using spheres (could make arrows pointing in direction of velocity)
const sphereMap = {};
for (let i = 0; i < numPoints; i++) {
  const sphereGeom = new THREE.SphereGeometry(0.04, 20, 20);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sphere = new THREE.Mesh(sphereGeom, sphereMaterial);
  sphere.position.x = Math.random() * 5;
  sphere.position.y = Math.random() * 5;
  sphere.position.z = Math.random() * 5;
  sphereMap[sphere.uuid] = sphere;

  scene.add(sphere);
}

const testSphere = new THREE.SphereGeometry(0.5, 20, 20);
const testMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const testObj = new THREE.Mesh(testSphere, testMaterial);
scene.add(testObj);

const getRandomPos = () => {
  return new THREE.Vector3(
    Math.random() * 5,
    Math.random() * 5,
    Math.random() * 5
  );
};

// axesHelper.rotateX(rotateRadians(-90));
// mesh.rotateX(rotateRadians(-90));
// pointCloud.rotateX(rotateRadians(-90));

// Animation
const increment = 0.004;
clock.start();
let previous = 0;
(function animate(now) {
  const current = Math.round(now / 1000);
  if (current - previous >= 1) {
    previous = current;
    // replace with actual population locations instead of getRandomPos(), or just manually set x/y/z
    // Object.keys(sphereMap).forEach((sphere) => {
    //   sphereMap[sphere].position.lerp(getRandomPos(), 0.01);
    // });
  }

  requestAnimationFrame(animate);
  controls.update();

  // mesh.rotation.y += increment;
  // axesHelper.rotation.y += increment;
  // pointCloud.rotation.y += increment;
  renderer.render(scene, camera);
})();
