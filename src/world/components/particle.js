import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";

export const createParticle = (position, fitness, zScaleFactor) => {
  const geometry = new SphereGeometry(0.04, 20, 20);
  const material = new MeshBasicMaterial({ color: 0xffffff });
  const particle = new Mesh(geometry, material);

  particle.position.x = position[1];
  particle.position.y = fitness(position[0], position[1]) * zScaleFactor;
  particle.position.z = position[0];

  return particle;
};
