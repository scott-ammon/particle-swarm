// Z defaults to perpendicular to the browser screen
// so we rotate objects to align for better appearance visually.
// Extracted here so we can apply the same transformation to all objects
export const rotateObjectInScene = (obj) => {
  obj.rotateX(-Math.PI / 2);
  obj.rotateZ(-Math.PI / 2);
};
