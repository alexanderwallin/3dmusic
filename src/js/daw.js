
// Vendor libs
import THREE from 'three';

// App libs
import Mixer from './mixer';
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

    this.mixer = new Mixer();

    this.mainVolume = this.ctx.createGain();
    this.mainVolume.gain.value = 1;
    this.mainVolume.connect(this.ctx.destination);
  }

  createInstruments() {
    this.instruments = [];

    let instrument1 = new Instrument({
      origin: new THREE.Vector3(1300, 0, 0),
      rotation: new THREE.Vector3(1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.002, 0, 0.002),
      audioContext: this.ctx,
      output: this.mainVolume,
      audioPath: 'assets/audio/organ.mp3'
    })
    this.instruments.push(instrument1);

    let instrument2 = new Instrument({
      origin: new THREE.Vector3(-1300, 0, 0),
      rotation: new THREE.Vector3(-1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.004, 0, 0.004),
      audioContext: this.ctx,
      output: this.mainVolume,
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
    this.mainVolume.gain.value = this.mixer.isMuted ? 0 : 1;

    for (let instrument of this.instruments) {
      instrument.update(time);
    }
  }
};
