import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";

export const createParticle = (position, fitness, zScaleFactor) => {
  const geometry = new SphereGeometry(0.04, 20, 20);
  const material = new MeshBasicMaterial({ color: 0xffffff });
  const particle = new Mesh(geometry, material);

  particle.position.x = position[0];
  particle.position.y = position[1];
  particle.position.z = fitness(position[0], position[1]) * zScaleFactor;

  return particle;
};
