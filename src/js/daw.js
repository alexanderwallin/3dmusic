
// Vendor libs
import THREE from 'three';

// App libs
import Mixer from './mixer';
import Instrument from './instrument';
import Sound from './sound';
import Spark from './spark';
import Reverb from './fx/reverb';

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

    this.masterReverb = new Reverb({
      ctx: this.ctx,
      gain: 1
    });

    this.mainVolume = this.ctx.createGain();
    this.mainVolume.gain.value = 1;

    this.mainVolume.connect(this.ctx.destination);
    this.mainVolume.connect(this.masterReverb.output);
    this.masterReverb.output.connect(this.ctx.destination);
  }

  createInstruments() {
    this.instruments = [];

    let instrument1 = new Instrument({
      origin: new THREE.Vector3(2000, 0, 0),
      rotation: new THREE.Vector3(1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.002, 0, 0.002),
      audioContext: this.ctx,
      output: this.mainVolume,
      audioPath: 'assets/audio/organ-lo.mp3'
    })
    this.instruments.push(instrument1);

    let instrument2 = new Instrument({
      origin: new THREE.Vector3(-2000, 0, 0),
      rotation: new THREE.Vector3(-1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.0045, 0.001, 0.0045),
      audioContext: this.ctx,
      output: this.mainVolume,
      audioPath: 'assets/audio/pipes-lo.mp3'
    })
    this.instruments.push(instrument2);

    let instrument3 = new Instrument({
      origin: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Vector3(-1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.0016, 0.0016, 0.0033),
      audioContext: this.ctx,
      output: this.mainVolume,
      audioPath: 'assets/audio/horn.mp3'
    })
    this.instruments.push(instrument3);

    for (let instrument of this.instruments) {

    }

    // Add sparks
    this.sparks = [];

    let spark1 = new Spark({
      instrument1: instrument1,
      instrument2: instrument2,
      distance: 1600,
      sound: new Sound({
        ctx: this.ctx,
        audioPath: 'assets/audio/hihat.mp3',
        output: this.mainVolume,
        gain: 0.3
      })
    });
    this.sparks.push(spark1);

    let spark2 = new Spark({
      instrument1: instrument1,
      instrument2: instrument3,
      distance: 1000,
      sound: new Sound({
        ctx: this.ctx,
        audioPath: 'assets/audio/bass-short.mp3',
        output: this.mainVolume
      })
    });
    this.sparks.push(spark2);
  }

  populate() {
    this.container = new THREE.Object3D();

    for (let instrument of this.instruments) {
      this.container.add(instrument.visuals);
    }

    for (let spark of this.sparks) {
      this.container.add(spark.linesContainer);
    }
  }

  update(time) {
    this.mainVolume.gain.value = this.mixer.isMuted ? 0 : 1;

    for (let instrument of this.instruments) {
      instrument.update(time);
    }

    for (let spark of this.sparks)
      spark.update(time);
  }
};
