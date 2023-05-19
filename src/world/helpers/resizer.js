export default class Resizer {
  constructor(container, camera, renderer) {
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener("resize", () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    });
  }
}
