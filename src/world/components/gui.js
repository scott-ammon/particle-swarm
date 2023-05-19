import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export const getGuiNode = () => {
  // Interface for providing parameterized inputs to the PSO function
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

  return guiNode;
};
