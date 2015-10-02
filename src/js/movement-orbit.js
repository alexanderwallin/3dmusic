
// Vendor libs
import THREE from 'three';

/**
 * Movement: Orbit
 */
export default class {
  constructor() {
    this.numObjects = 0;
    this.radius = 400;
    this.speed = 0.007;
  }

  setNumObjects(count) {
    this.numObjects = count;
  }

  getObjectPositionDiff(object, index, currentTime) {
    let phase = 2 * Math.PI * (index / this.numObjects);
    let diff = new THREE.Vector3();
    diff.x = this.radius * Math.sin(phase + currentTime * this.speed);
    diff.z = this.radius * Math.cos(phase + currentTime * this.speed);
    return diff;
  }
}