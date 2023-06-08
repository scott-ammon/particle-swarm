import { Color, Group, Scene, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import PSO from "../pso";
import { createCamera } from "./components/camera";
import { getGuiNode } from "./components/gui";
import { getMesh } from "./components/equationMesh";
import Resizer from "./helpers/resizer";
import { createParticle } from "./components/particle";
import { rotateObjectInScene } from "./helpers/rotateScene";

export default class Graph {
  constructor(equation) {
    this.pso;
    this.intervalId;
    this.equation;
    this.currentPositions;
    this.msBetweenIterations = 1000;
    this.zScaleFactor = 0.2;
    this.particleGroup = new Group();
    rotateObjectInScene(this.particleGroup);
    this.particleGroupName = "particleGroup";
    this.particleGroup.name = this.particleGroupName;
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

  resetPso() {
    this.pso = null;
    this.currentPositions = null;
    this.particleGroup.clear();
    clearInterval(this.intervalId);
  }

  setGraph(equation) {
    this.scene.children.forEach((obj) => this.scene.remove(obj));
    this.equation = equation;

    const mesh = getMesh(this.equation, this.zScaleFactor);
    this.scene.add(mesh);
  }

  startSimulation = () => {
    this.pso = new PSO(this.guiNode.populationSize, this.equation);

    const result = this.pso.runPso(this.equation, {
      ...this.guiNode,
      zScaleFactor: this.zScaleFactor,
    });
    this.currentPositions = result.next().value;

    this.currentPositions.forEach((position) => {
      const particle = createParticle(
        position,
        this.equation,
        this.zScaleFactor
      );

      this.particleGroup.add(particle);
    });

    this.scene.add(this.particleGroup);

    this.intervalId = setInterval(() => {
      if (result !== undefined) {
        this.currentPositions = result.next().value;
      }
    }, this.msBetweenIterations);

    document.getElementById("button-run-pso").disabled = true;
    document.getElementById("button-reset").classList.remove("invisible");
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
