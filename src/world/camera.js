import { PerspectiveCamera } from "three";

export const createCamera = (renderer) => {
  const camera = new PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.x = 15;
  camera.position.y = 15;
  camera.position.z = 15;

  return camera;
};
