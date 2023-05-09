// Particle Swarm Optimization Algorithm

const minBound = 0;
const maxBound = 5;
const minVelocity = -1;
const maxVelocity = 1;
let stopThreshold = 0.001;
let stop = false;
let iteration = 0;

let population = [];
let personalBest = [];
let globalBest = [];
let velocities = [];

// The function we are trying to minimize
export const fitness = (x, y) => {
  return (
    Math.pow(x - Math.PI, 2) +
    Math.pow(y - 2.72, 2) +
    Math.sin(3 * x + 1.41) +
    Math.sin(4 * y - 1.73)
  );
};

const getRandomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Initialize the particles of the population and set personal & global bests
const init = (populationSize) => {
  for (let i = 0; i < populationSize; i++) {
    const x = getRandomInRange(minBound, maxBound);
    const y = getRandomInRange(minBound, maxBound);

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
};

export function* runPso(
  populationSize,
  maxIterations,
  w,
  cP,
  cG,
  k,
  earlyStop
) {
  init(populationSize);

  while (!stop && iteration <= maxIterations) {
    const precision = 10000;
    const printX = Math.round(globalBest[0] * precision) / precision;
    const printY = Math.round(globalBest[1] * precision) / precision;
    const printZ = Math.round(fitness(...globalBest) * precision) / precision;

    document.getElementById("iteration").firstChild.nodeValue = iteration;
    document.getElementById(
      "globalBestValues"
    ).firstChild.nodeValue = `X: ${printX} Y: ${printY} Z: ${printZ}`;
    yield population;
    population.forEach((particle, particleIndex) => {
      particle.forEach((dimension, dimensionIndex) => {
        const rP = Math.random();
        const rG = Math.random();
        // update particle velocity
        velocities[particleIndex][dimensionIndex] =
          w +
          cP *
            rP *
            (personalBest[particleIndex][dimensionIndex] -
              particle[dimensionIndex]) +
          cG * rG * (globalBest[dimensionIndex] - particle[dimensionIndex]);

        // update particle's position
        particle[dimensionIndex] += velocities[particleIndex][dimensionIndex];
        // restrict particle's position to within the min and max bound
        if (particle[dimensionIndex] > maxBound) {
          particle[dimensionIndex] = maxBound;
        } else if (particle[dimensionIndex] < minBound) {
          particle[dimensionIndex] = minBound;
        }
      });

      // if fitness better than personal best, update personal best
      if (fitness(...particle) < fitness(...personalBest[particleIndex])) {
        personalBest[particleIndex] = [...particle];
        // if fitness is better than global best, update global best
        if (fitness(...particle) < fitness(...globalBest)) {
          // set stop condition
          if (
            Math.abs(globalBest[0] - particle[0]) < stopThreshold &&
            Math.abs(globalBest[1] - particle[1]) < stopThreshold
          ) {
            if (earlyStop) {
              stop = true;
            }
          }
          globalBest = [...particle];
        }
      }
    });

    iteration++;
    w *= k; // inertial decrement
  }
}
