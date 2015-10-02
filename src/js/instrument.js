
// Vendor libs
import THREE from 'three';

// App libs
import OrbitMovement from './movement-orbit';

/**
 * Instrument
 */
export default class {
  constructor(options) {
    this.visuals = new THREE.Object3D();

    // Options
    this.origin = options.origin;
    this.rotation = new THREE.Vector3(0, 0, 0);

    // Create instances
    this.instances = new Array();

    // Cube 1
    let geometry1 = new THREE.BoxGeometry( 200, 200, 200 );
    let material1 = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    let instance1 = new THREE.Mesh(geometry1, material1);
    this.instances.push(instance1);

    // Cube 2
    let geometry2 = new THREE.BoxGeometry( 200, 200, 200 );
    let material2 = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    let instance2 = new THREE.Mesh(geometry2, material2);
    this.instances.push(instance2);

    // Add instances to visuals
    for (let instance of this.instances) {
      instance.position.fromArray(this.origin.toArray());
      instance.userData.positionStart = instance.position.clone();
      this.visuals.add(instance);
    }
    
    // Add a movement pattern
    this.movement = new OrbitMovement();
    this.movement.setNumObjects(this.instances.length);
  }

  /**
   * Updates sound instances positions
   */
  update(time) {

    // Update x-axis rotation
    this.rotation.setX(time * 0.0004);

    // Adjust positions according to the movement
    for (let i in this.instances) {
      let instance = this.instances[i];
      let positionDiff = this.movement.getObjectPositionDiff(i, this.rotation, time);
      let newPosition = instance.userData.positionStart.clone().add(positionDiff).toArray();
      instance.position.fromArray(newPosition);
    }
  }
}