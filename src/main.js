import Graph from "./world/root.js";

// Equations to select from dropdown
export const exampleEquations = [
  (x, y) => {
    return (
      Math.pow(x - Math.PI, 2) +
      Math.pow(y - 2.72, 2) +
      Math.sin(3 * x + 1.41) +
      Math.sin(4 * y - 1.73)
    );
  },
  (x, y) => {
    return Math.pow(x, 2) + Math.pow(y, 2);
  },
];
export let selectedEquation = 0;

const graphObj = new Graph(exampleEquations[selectedEquation]);
graphObj.animate();

const runButton = document.getElementById("button-run-pso");
runButton.addEventListener("click", graphObj.startSimulation);

const dropdown = document.getElementById("select-equation");
dropdown.addEventListener("change", function () {
  graphObj.setGraph(exampleEquations[this.value]);
});
