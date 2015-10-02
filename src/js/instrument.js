
// Vendor libs
import THREE from 'three';

// App libs
import OrbitMovement from './movement-orbit';
import Sound from './sound';

/**
 * Instrument
 */
export default class {
  constructor(options) {
    this.visuals = new THREE.Object3D();

    // Options
    this.origin = options.origin;
    this.rotation = options.rotation;
    this.rotationSpeed = options.rotationSpeed;

    // Sounds
    this.ctx       = options.audioContext;
    this.audioPath = options.audioPath;
    this.sounds    = new Array();

    this.volume    = this.ctx.createGain();
    this.volume.gain.value = 0.5;

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
    for (let i in this.instances) {
      let instance = this.instances[i];
      instance.position.fromArray(this.origin.toArray());
      instance.userData.positionStart = instance.position.clone();
      this.visuals.add(instance);

      let sound = new Sound({
        ctx: this.ctx,
        output: this.ctx.destination,
        audioPath: this.audioPath,
        autoplay: true
      });
      sound.volume.gain.value = 1 / this.instances.length;
      this.sounds[i] = sound;
    }
    
    // Add a movement pattern
    this.movement               = new OrbitMovement();
    this.movement.numObjects    = this.instances.length;
    this.movement.rotation      = this.rotation.clone();
    this.movement.rotationSpeed = this.rotationSpeed.clone();
  }

  /**
   * Updates sound instances positions
   */
  update(time) {

    // Adjust positions according to the movement
    for (let i in this.instances) {
      let instance = this.instances[i];
      let positionDiff = this.movement.getObjectPositionDiff(i, time);
      let newPosition = instance.userData.positionStart.clone().add(positionDiff);
      instance.position.fromArray(newPosition.toArray());

      // console.log('newPosition', newPosition);
      this.sounds[i].panner.setPosition(newPosition.x, newPosition.y, newPosition.z);
    }
  }
}