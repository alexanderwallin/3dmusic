
// Vendor libs
import THREE from 'three';

/**
 * Movement: Orbit
 */
export default class {
  constructor() {
    this.numObjects = 0;
    this.radius = 400;
  }

  setNumObjects(count) {
    this.numObjects = count;
  }

  getObjectPositionDiff(object, index) {
    let phase = 2 * Math.PI * (index / this.numObjects);
    let diff = new THREE.Vector3();
    let now = Date.now();
    diff.x = this.radius * Math.sin(phase + now / 1000);
    diff.z = this.radius * Math.cos(phase + now / 1000);
    return diff;
  }
}