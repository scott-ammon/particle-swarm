import { Color, Group, Scene, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { runPso } from "../pso";
import { createCamera } from "./components/camera";
import { getGuiNode } from "./components/gui";
import { getMesh } from "./components/equationMesh";
import Resizer from "./helpers/resizer";
import { createParticle } from "./components/particle";
import { rotateObjectInScene } from "./helpers/rotateScene";

export default class Graph {
  constructor(equation) {
    this.equation;
    this.currentPositions;
    this.result;
    this.msBetweenIterations = 1000;
    this.zScaleFactor = 0.2;
    this.particleGroup = new Group();
    this.guiNode = getGuiNode();

    this.scene = new Scene();
    this.scene.background = new Color("black");

    this.renderer = new WebGLRenderer();
    document.body.appendChild(this.renderer.domElement);

    this.camera = createCamera();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    new Resizer(document.body, this.camera, this.renderer);

    this.setGraph(equation);
  }

  setGraph(equation) {
    this.scene.children.forEach((obj) => this.scene.remove(obj));
    this.equation = equation;

    const mesh = getMesh(this.equation, this.zScaleFactor);
    this.scene.add(mesh);
  }

  startSimulation = () => {
    if (!this.result) {
      this.result = runPso(this.equation, {
        ...this.guiNode,
        zScaleFactor: this.zScaleFactor,
      });
      this.currentPositions = this.result.next().value;

      this.currentPositions.forEach((position) => {
        const particle = createParticle(
          position,
          this.equation,
          this.zScaleFactor
        );

        this.particleGroup.add(particle);
      });

      rotateObjectInScene(this.particleGroup);
      this.scene.add(this.particleGroup);

      setInterval(() => {
        if (this.result !== undefined) {
          this.currentPositions = this.result.next().value;
        }
      }, this.msBetweenIterations);
    }
  };

  animate = () => {
    if (this.currentPositions) {
      this.currentPositions.forEach((position, i) => {
        const newLocation = new Vector3(...position);
        this.particleGroup.children[i].position.lerp(newLocation, 0.03);
      });
    }

    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
