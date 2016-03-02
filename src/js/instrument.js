
// Vendor libs
import THREE from 'three';
import TWEEN from 'tween.js';

// App libs
import OrbitMovement from './movement-orbit';
import Sound from './sound';
import Glow from './vfx/glow';
import ctx from './audio-context';

/**
 * Instrument
 */
export default class {
  constructor(options) {
    this.visuals = new THREE.Object3D();

    this.isActivated = true;

    // Options
    this.origin = options.origin;
    this.rotation = options.rotation;
    this.rotationSpeed = options.rotationSpeed;

    // Visual options
    this.color = new THREE.Color(Math.random(), Math.random(), Math.random());

    // Sounds
    this.audioPath = options.audioPath;
    this.sounds    = new Array();

    this.input = ctx.createGain();
    this.output = ctx.createGain();

    // Create instances
    this.instances = new Array();

    // Cube 1
    let geometry1 = new THREE.SphereGeometry( 20, 20 );
    let material1 = new THREE.MeshBasicMaterial( { color: this.color, transparent: true, opacity: 0 } );
    let instance1 = new THREE.Mesh(geometry1, material1);
    this.instances.push(instance1);

    // Cube 2
    let geometry2 = new THREE.SphereGeometry( 20, 20 );
    let material2 = new THREE.MeshBasicMaterial( { color: this.color, transparent: true, opacity: 0 } );
    let instance2 = new THREE.Mesh(geometry2, material2);
    this.instances.push(instance2);

    // Add instances to visuals
    for (let i in this.instances) {
      let instance = this.instances[i];
      instance.position.fromArray(this.origin.toArray());
      instance.userData.positionStart = instance.position.clone();
      this.visuals.add(instance);

      // Volume glow
      const instanceGlow = new Glow(i, instance);
      instance.userData.glow = instanceGlow;
      this.visuals.add(instance.userData.glow.mesh);

      let sound = new Sound({
        audioPath: this.audioPath
      });
      sound.output.gain.value = 1 / this.instances.length;
      sound.output.connect(this.output);
      sound.play();
      this.sounds[i] = sound;
    }

    // Add a movement pattern
    this.movement               = new OrbitMovement();
    this.movement.numObjects    = this.instances.length;
    this.movement.rotation      = this.rotation.clone();
    this.movement.rotationSpeed = this.rotationSpeed.clone();
  }

  /**
   * Sets activated state
   */
  setActivated(activated) {
    this.fadeVisuals(activated ? 1 : 0);

    this.isActivated = activated;
  }

  /**
   * Fades visuals in or out
   */
  fadeVisuals(opacity) {
    let _this = this;

    let tween = new TWEEN.Tween({ opacity: this.instances[0].material.opacity })
      .to({ opacity: opacity }, 600)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function() {
        for (let mesh of _this.instances) {
          mesh.material.opacity = this.opacity;
        }
      })
      .start();
  }

  /**
   * Updates sound instances positions
   */
  update(time, audioLevel = 0) {

    // Adjust positions according to the movement
    for (let i in this.instances) {
      let instance = this.instances[i];
      let positionDiff = this.movement.getObjectPositionDiff(i, time);
      let newPosition = instance.userData.positionStart.clone().add(positionDiff);
      instance.position.fromArray(newPosition.toArray());

      // Update glow
      instance.userData.glow.update(time, audioLevel);

      // console.log('newPosition', newPosition);
      this.sounds[i].panner.setPosition(newPosition.x, newPosition.y, newPosition.z);
    }
  }
}
