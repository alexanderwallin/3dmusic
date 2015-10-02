
// Vendor libs
import THREE from 'three';

// App libs
import { axisX } from './space';

/**
 * Movement: Orbit
 */
export default class {
  constructor() {
    this.numObjects = 0;
    this.radius = 400;
    this.speed = 0.007;

    this.rotation;
    this.rotationSpeed;
  }

  getObjectPositionDiff(index, currentTime) {
    let phase = 2 * Math.PI * (index / this.numObjects);
    let diff = new THREE.Vector3();
    diff.x = this.rotation.x * this.radius * Math.sin(phase + currentTime * this.rotationSpeed.x);
    diff.z = this.rotation.z * this.radius * Math.cos(phase + currentTime * this.rotationSpeed.z);

    diff.applyAxisAngle(axisX, this.rotation.y * currentTime * this.rotationSpeed.y);

    return diff;
  }
}