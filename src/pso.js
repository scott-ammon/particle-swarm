// Particle Swarm Optimization Algorithm
// This is a simple hardcoded implementation for a specific function to minimize,
// it could be generalized to take in a function with n-parameters

export default class PSO {
  constructor(populationSize, fitness) {
    this.minBound = 0;
    this.maxBound = 5;
    this.minVelocity = -1;
    this.maxVelocity = 1;
    this.stopThreshold = 0.001;
    this.stop = false;
    this.iteration = 0;

    this.population = [];
    this.personalBest = [];
    this.globalBest = [];
    this.velocities = [];

    // Initialize the particles of the population and set personal & global bests
    for (let i = 0; i < populationSize; i++) {
      const x = this.getRandomInRange(this.minBound, this.maxBound);
      const y = this.getRandomInRange(this.minBound, this.maxBound);

      this.population[i] = [x, y];
      this.personalBest[i] = [x, y];

      if (
        this.globalBest.length === 0 ||
        fitness(x, y) < fitness(this.globalBest[0], this.globalBest[1])
      ) {
        this.globalBest = [x, y];
      }

      // initialize particle velocity
      this.velocities[i] = [
        this.getRandomInRange(this.minVelocity, this.maxVelocity),
        this.getRandomInRange(this.minVelocity, this.maxVelocity),
      ];
    }
  }

  getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  *runPso(fitness, options) {
    let {
      maxIterations,
      weight,
      cPersonal,
      cGlobal,
      inertialDecrement,
      earlyStop,
      zScaleFactor,
    } = options;

    while (!this.stop && this.iteration <= maxIterations) {
      const precision = 10000;
      const printX = Math.round(this.globalBest[0] * precision) / precision;
      const printY = Math.round(this.globalBest[1] * precision) / precision;
      const printZ = Math.round(fitness(...this.globalBest) * precision) / precision;

      // Update the UI on each iteration with global best position
      document.getElementById("iteration").firstChild.nodeValue = this.iteration;
      document.getElementById(
        "globalBestValues"
      ).firstChild.nodeValue = `x: ${printX} y: ${printY} z: ${printZ}`;

      // return current iteration's population from the generator func
      const positions = this.population.map((particle) => [
        ...particle,
        fitness(...particle) * zScaleFactor,
      ]);
      yield positions;

      this.population.forEach((particle, i) => {
        for (let d = 0; d < 2; d++) {
          const rP = Math.random();
          const rG = Math.random();
          // update particle velocity
          this.velocities[i][d] =
            weight +
            cPersonal * rP * (this.personalBest[i][d] - particle[d]) +
            cGlobal * rG * (this.globalBest[d] - particle[d]);

          // update particle's position
          particle[d] += this.velocities[i][d];
          // restrict particle's position to within min/max bounds
          if (particle[d] > this.maxBound) {
            particle[d] = this.maxBound;
          } else if (particle[d] < this.minBound) {
            particle[d] = this.minBound;
          }
        }

        // if fitness better than personal best, update personal best
        if (fitness(...particle) < fitness(...this.personalBest[i])) {
          this.personalBest[i] = [...particle];
          // if fitness is better than global best, update global best
          if (fitness(...particle) < fitness(...this.globalBest)) {
            // if earlyStop is set in the UI, kill while loop if solution
            // at prev & curr iteration differs by less than the stopThreshold we set
            if (
              Math.abs(this.globalBest[0] - particle[0]) < this.stopThreshold &&
              Math.abs(this.globalBest[1] - particle[1]) < this.stopThreshold
            ) {
              if (earlyStop) {
                this.stop = true;
              }
            }
            this.globalBest = [...particle];
          }
        }
      });

      this.iteration++;
      weight *= inertialDecrement; // inertial decrement applied to the weight at each iteration
    }
  }
}
