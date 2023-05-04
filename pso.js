// Particle Swarm Optimization Algorithm

// TODO parameterize these as inputs from the webpage
const populationSize = 500;
const maxIterations = 25;

let weight = 1;
const c1 = 1.5;
const c2 = 1.5;
const k = 0.1;
const dimensions = 3;

const minX = 0;
const maxX = 5;
const minY = 0;
const maxY = 5;
const minVelocity = -1;
const maxVelocity = 1;

let population = [];
let personalBest = [];
let globalBest = [];
let velocities = [];

// The function we are trying to minimize
export const fitness = (x, y) => {
  return (
    (Math.pow(x - Math.PI, 2) +
      Math.pow(y - 2.72, 2) +
      Math.sin(3 * x + 1.41) +
      Math.sin(4 * y - 1.73))
  );
};

const getRandomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Initialize the particles of the population and set personal & global bests
for (let i = 0; i < populationSize; i++) {
  const x = getRandomInRange(minX, maxX);
  const y = getRandomInRange(minY, maxY);

  population[i] = [x, y];
  personalBest[i] = [x, y];

  if (
    globalBest.length === 0 ||
    fitness(x, y) < fitness(globalBest[0], globalBest[1])
  ) {
    globalBest = [x, y];
  }

  // initialize particle velocity
  velocities[i] = [
    getRandomInRange(minVelocity, maxVelocity),
    getRandomInRange(minVelocity, maxVelocity),
  ];
}

let iteration = 0;

export function* runPso() {
  while (iteration <= maxIterations) {
    yield population;
    population.forEach((particle, particleIndex) => {
      particle.forEach((dimension, dimensionIndex) => {
        const rP = Math.random();
        const rG = Math.random();
        // update particle velocity
        velocities[particleIndex][dimensionIndex] =
          weight +
          c1 *
            rP *
            (personalBest[particleIndex][dimensionIndex] -
              particle[dimensionIndex]) +
          c1 * rG * (globalBest[dimensionIndex] - particle[dimensionIndex]);

        // update particle's position
        particle[dimensionIndex] += velocities[particleIndex][dimensionIndex];
      });

      // if fitness better than personal best, update personal best
      if (fitness(...particle) < fitness(...personalBest[particleIndex])) {
        personalBest[particleIndex] = [...particle];
        // if fitness is better than global best, update global best
        if (fitness(...particle) < fitness(...globalBest)) {
          globalBest = [...particle];
        }
      }
    });
    console.log("Iteration", iteration, "complete");
    iteration++;
    weight *= k; // inertial decrement
  }
}

// console.log("Population is", population);
// console.log("Global best position is", globalBest);
// console.log("Global best fitness is", fitness(...globalBest));
