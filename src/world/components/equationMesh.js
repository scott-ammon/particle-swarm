import {
  DoubleSide,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  WireframeGeometry,
} from "three";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

export const getMesh = (fitness, zScaleFactor) => {
  const shapeDefinition = (u, v, target) => {
    const x = u * 5;
    const y = v * 5;
    const z = fitness(x, y) * zScaleFactor;

    target.set(x, y, z);
  };

  const geometry = new ParametricGeometry(shapeDefinition, 100, 100);
  const material = new MeshBasicMaterial({
    color: 0x000000,
    side: DoubleSide,
    transparent: true,
    opacity: 0,
  });
  const mesh = new Mesh(geometry, material);

  const wireframeGeometry = new WireframeGeometry(geometry);
  const wireframeMaterial = new LineBasicMaterial({ color: 0x1ce1f2 });
  const wireframe = new LineSegments(wireframeGeometry, wireframeMaterial);

  mesh.add(wireframe);

  return mesh;
};
