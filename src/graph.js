import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { runPso } from "./pso";

export default class Graph {
  constructor(fitness) {
    this.fitness = fitness;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.scene.background = new THREE.Color("black");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.x = 15;
    this.camera.position.y = 15;
    this.camera.position.z = 15;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.axesHelper = new THREE.AxesHelper(5);
    this.scene.add(this.axesHelper);

    // GUI for providing inputs to the PSO func
    this.gui = new GUI();
    this.guiNode = {
      populationSize: 100,
      maxIterations: 25,
      weight: 1,
      cPersonal: 1.5,
      cGlobal: 1.5,
      inertialDecrement: 0.3,
      earlyStop: false,
    };
    this.gui.add(this.guiNode, "populationSize", 10, 1000).step(1);
    this.gui.add(this.guiNode, "maxIterations", 1, 50).step(1);
    this.gui.add(this.guiNode, "weight", 0, 3).step(0.1);
    this.gui.add(this.guiNode, "cPersonal", 0.5, 2.5).step(0.1);
    this.gui.add(this.guiNode, "cGlobal", 0.5, 2.5).step(0.1);
    this.gui.add(this.guiNode, "inertialDecrement", 0.1, 0.9).step(0.1);
    this.gui.add(this.guiNode, "earlyStop");
    this.gui.open();

    this.currentPositions;
    this.result;
    this.sphereMap = {};
  }

  setGraph(fitness) {
    // remove the previous example graph surface (but leave axes helper in place)
    this.scene.remove(this.scene.children[1]);
    this.fitness = fitness;

    // Geometry of function to minimize
    this.scaleFactor = 0.2; // z valuesx are too large, so we scale down to make it visually work
    this.shapeDefinition = (v, u, target) => {
      const x = u * 5;
      const y = v * 5;
      const z = this.fitness(x, y) * this.scaleFactor;

      target.set(y, z, x); // flipping axes to visualize better since default is z perp to screen
    };

    this.geometry = new ParametricGeometry(this.shapeDefinition, 100, 100);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.wireframeGeometry = new THREE.WireframeGeometry(this.geometry);
    this.wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x1ce1f2 });
    this.wireframe = new THREE.LineSegments(
      this.wireframeGeometry,
      this.wireframeMaterial
    );
    this.mesh.add(this.wireframe);
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
          ) * this.scaleFactor,
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
          ) * this.scaleFactor,
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
