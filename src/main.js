import Graph from "./world/graph.js";

// Equations to select from
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
  (x, y) => {
    return 10 * Math.sin(5 * x) * Math.cos(5 * y);
  },
  (x, y) => {
    return Math.sin(Math.pow(x, 2) + Math.pow(y, 2)) * (x + y);
  },
];

const graphObj = new Graph(exampleEquations[0]);
graphObj.animate();

const radioButtons = document.querySelectorAll("input[type=radio]");
Array.prototype.forEach.call(radioButtons, (radio) => {
  radio.addEventListener("change", handleRadioChange);
});

function handleRadioChange() {
  graphObj.scene.children.forEach((obj) => graphObj.scene.remove(obj));
  graphObj.setGraph(exampleEquations[this.value]);
}

function runPso() {
  radioButtons.forEach((radio) => {
    if (!radio.checked) {
      radio.disabled = true;
    }
  });
  graphObj.startSimulation();
}

const runButton = document.getElementById("button-run-pso");
runButton.addEventListener("click", runPso);

const resetButton = document.getElementById("button-reset");
resetButton.addEventListener("click", () => {
  document.getElementById("button-run-pso").disabled = false;
  document.getElementById("button-reset").classList.add("invisible");
  radioButtons.forEach((radio) => (radio.disabled = false));
  graphObj.resetPso();
});
