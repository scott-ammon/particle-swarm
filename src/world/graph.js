import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { runPso } from "../pso";
import { createCamera } from "./camera";
import { getGuiNode } from "./gui";
import { getMesh } from "./mesh";
import Resizer from "./resizer";

export default class Graph {
  constructor(equation) {
    this.fitness;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.scene.background = new THREE.Color("black");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container = document.body;
    this.container.appendChild(this.renderer.domElement);
    new Resizer(this.container, this.camera, this.renderer);

    this.camera = createCamera();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.axesHelper = new THREE.AxesHelper(5);
    this.scene.add(this.axesHelper);

    this.guiNode = getGuiNode();

    this.currentPositions;
    this.result;
    this.sphereMap = {};

    this.setGraph(equation);
  }

  setGraph(fitness) {
    // remove the previous example graph surface (but leave axes helper in place)
    this.scene.remove(this.scene.children[1]);
    this.fitness = fitness;
    this.zScaleFactor = 0.2; // z valuesx are too large, so we scale down to make it visually work

    const mesh = getMesh(this.fitness, this.zScaleFactor);

    this.scene.add(mesh);
  }

  startSimulation = () => {
    if (!this.result) {
      this.result = runPso(
        this.fitness,
        this.guiNode.populationSize,
        this.guiNode.maxIterations,
        this.guiNode.weight,
        this.guiNode.cPersonal,
        this.guiNode.cGlobal,
        this.guiNode.inertialDecrement,
        this.guiNode.earlyStop
      );
      this.currentPositions = this.result.next().value;

      for (let i = 0; i < this.currentPositions.length; i++) {
        const sphereGeom = new THREE.SphereGeometry(0.04, 20, 20);
        const sphereMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
        });
        const sphere = new THREE.Mesh(sphereGeom, sphereMaterial);
        const startingLocation = new THREE.Vector3(
          this.currentPositions[i][1],
          this.fitness(
            this.currentPositions[i][0],
            this.currentPositions[i][1]
          ) * this.zScaleFactor,
          this.currentPositions[i][0]
        );
        sphere.position.x = startingLocation.x;
        sphere.position.y = startingLocation.y;
        sphere.position.z = startingLocation.z;
        this.sphereMap[sphere.uuid] = sphere;
        this.scene.add(sphere);
      }

      // Call generator to get next optimization iteration result
      setInterval(() => {
        // generator returns undefined when function completes
        if (this.result !== undefined) {
          this.currentPositions = this.result.next().value;
        }
      }, 1000);
    }
  };

  animate = () => {
    if (this.currentPositions) {
      Object.keys(this.sphereMap).forEach((sphere, i) => {
        const newLocation = new THREE.Vector3(
          this.currentPositions[i][1],
          this.fitness(
            this.currentPositions[i][0],
            this.currentPositions[i][1]
          ) * this.zScaleFactor,
          this.currentPositions[i][0]
        );
        this.sphereMap[sphere].position.lerp(newLocation, 0.03);
      });
    }

    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
