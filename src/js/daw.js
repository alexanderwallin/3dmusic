
// Vendor libs
import THREE from 'three';

// App libs
import ctx from './audio-context';
import Mixer from './mixer';
import Instrument from './instrument';
import Sound from './sound';
import Spark from './spark';
import Reverb from './fx/reverb';
import Compressor from './fx/compressor';
import VFXHitRing from './vfx/hitring';
import VFXLineRaster from './vfx/line-raster';

/**
 * DAW
 */
export default class {
  constructor() {
    this.setupMixer();
    this.createInstruments();
    this.populate();
  }

  /**
   * Creates the mixer
   */
  setupMixer() {
    this.mixer = new Mixer();

    // Add fx
    // this.mixer.master.addFx(new Reverb({ gain: 0.1 }));
    this.mixer.master.addFx(new Compressor());

    this.mixer.master.output.connect(ctx.destination);
  }

  /**
   * Adds instruments to mixer
   */
  createInstruments() {
    let rotationSpeedScalar = 0.5;

    let instrument1 = new Instrument({
      origin: new THREE.Vector3(2000, 0, 0),
      rotation: new THREE.Vector3(1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.005, 0, 0.005).multiplyScalar(rotationSpeedScalar),
      audioPath: 'assets/audio/organ-lo.mp3'
    });
    this.mixer.setInstrumentAt(instrument1, 0);

    let instrument2 = new Instrument({
      origin: new THREE.Vector3(-2000, 0, 0),
      rotation: new THREE.Vector3(-1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.0055, 0.001, 0.0055).multiplyScalar(rotationSpeedScalar),
      audioPath: 'assets/audio/pipes-lo.mp3'
    });
    this.mixer.setInstrumentAt(instrument2, 1);

    let instrument3 = new Instrument({
      origin: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Vector3(-1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.0016, 0.0016, 0.0043).multiplyScalar(rotationSpeedScalar),
      audioPath: 'assets/audio/horn.mp3'
    });
    this.mixer.setInstrumentAt(instrument3, 2);

    let instrument4 = new Instrument({
      origin: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Vector3(1, -1, 1),
      rotationSpeed: new THREE.Vector3(-0.0027, 0.0021, -0.0038).multiplyScalar(rotationSpeedScalar),
      gain: 0.05,
      audioPath: 'assets/audio/pipes.mp3'
    });
    this.mixer.setInstrumentAt(instrument4, 3);
    this.mixer.setTrackVolume(3, 0.2);

    // Add sparks
    this.sparks = [];

    let spark1 = new Spark({
      instrument1: instrument1,
      instrument2: instrument2,
      distance: 1600,
      sound: new Sound({
        audioPath: 'assets/audio/hihat.mp3',
        gain: 0.3
      })
    });
    this.sparks.push(spark1);

    let spark2 = new Spark({
      instrument1: instrument1,
      instrument2: instrument3,
      distance: 1000,
      sound: new Sound({
        audioPath: 'assets/audio/bass-short.mp3',
        gain: 0.8
      }),
      vfxs: [new VFXLineRaster()]
    });
    this.sparks.push(spark2);

    let spark3 = new Spark({
      instrument1: instrument1,
      instrument2: instrument4,
      distance: 800,
      sound: new Sound({
        audioPath: 'assets/audio/kick.mp3',
        gain: 1
      }),
      vfxs: [new VFXHitRing()]
    });
    this.sparks.push(spark3);

    for (let spark of this.sparks) {
      spark.sound.output.connect(this.mixer.master.input);
    }
  }

  /**
   * Adds visual elements to world
   */
  populate() {
    this.container = new THREE.Object3D();

    for (let track of this.mixer.tracks) {
      if (track.instrument)
        this.container.add(track.instrument.visuals);
    }

    for (let spark of this.sparks) {
      this.container.add(spark.linesContainer);

      for (let vfx of spark.vfxs)
        this.container.add(vfx.mesh);
    }
  }

  /**
   * Next frame plz
   */
  update(time) {
    for (let track of this.mixer.tracks) {
      if (track.instrument)
        track.instrument.update(time);
    }

    for (let spark of this.sparks)
      spark.update(time);
  }
};
