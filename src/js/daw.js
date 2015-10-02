
// Vendor libs
import THREE from 'three';

// App libs
import Instrument from './instrument';

/**
 * DAW
 */
export default class {
  constructor() {
    this.createAudioContext();
    this.createInstruments();
    this.populate();
  }

  createAudioContext() {
    this.ctx = new AudioContext();

    this.mainVolume = this.ctx.createGain();
    this.mainVolume.gain.value = 1;
  }

  createInstruments() {
    this.instruments = [];

    let instrument1 = new Instrument({
      origin: new THREE.Vector3(1300, 0, 0),
      rotation: new THREE.Vector3(1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.002, 0, 0.002),
      audioContext: this.ctx,
      audioPath: 'assets/audio/organ.mp3'
    })
    this.instruments.push(instrument1);

    let instrument2 = new Instrument({
      origin: new THREE.Vector3(-1300, 0, 0),
      rotation: new THREE.Vector3(-1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.004, 0, 0.004),
      audioContext: this.ctx,
      audioPath: 'assets/audio/pipes.mp3'
    })
    this.instruments.push(instrument2);

    for (let instrument of this.instruments) {

    }
  }

  populate() {
    this.container = new THREE.Object3D();

    for (let instrument of this.instruments) {
      this.container.add(instrument.visuals);
    }
  }

  update(time) {
    for (let instrument of this.instruments) {
      instrument.update(time);
    }
  }
};
