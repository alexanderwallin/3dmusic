
// Vendor libs
import THREE from 'three';

/**
 * Instrument
 */
export default class {
  constructor() {
    this.visuals = new THREE.Object3D();
    this.addInstances();
  }

  addInstances() {
    this.instances = new Array();

    // A ball
    let geometry = new THREE.BoxGeometry( 200, 200, 200 );
    let material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    let instance1 = new THREE.Mesh(geometry, material);
    instance1.position.x = Math.random() * 1000 - 500;
    this.instances.push(instance1);

    // Add instances to visuals
    for (let instance of this.instances) {
      this.visuals.add(instance);
    }
  }

  update() {
    for (let instance of this.instances) {
      instance.rotation.y += 0.01;
      instance.rotation.z += 0.01;
    }
  }
}