
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
import Tremolo from './fx/tremolo';
import VFXHitRing from './vfx/hitring';
import VFXLineRaster from './vfx/line-raster';

/**
 * DAW
 */
export default class {
  constructor() {
    this.container = new THREE.Object3D();

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
    this.mixer.master.addFx(new Compressor({
      ratio: 4,
      threshold: -20,
      knee: 4,
      reduction: -20
    }));

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
    this.mixer.setTrackVolume(0, 0.4);
    this.mixer.setInstrumentAt(instrument1, 0);
    this.mixer.tracks[0].setActivated(true);

    let instrument4 = new Instrument({
      origin: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Vector3(1, -1, 1),
      rotationSpeed: new THREE.Vector3(-0.0027, 0.0021, -0.0038).multiplyScalar(rotationSpeedScalar),
      gain: 0.05,
      audioPath: 'assets/audio/pipes.mp3'
    });
    this.mixer.setTrackVolume(1, 0.2);
    this.mixer.setInstrumentAt(instrument4, 1);
    this.mixer.tracks[1].addFx(new Tremolo({
      rate: 0.0002
    }));

    let instrument5 = new Instrument({
      origin: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Vector3(0.3, -1, -0.1).multiplyScalar(1.4),
      rotationSpeed: new THREE.Vector3(0.0011, 0.0007, -0.0017).multiplyScalar(rotationSpeedScalar),
      gain: 0.05,
      audioPath: 'assets/audio/zelda.mp3'
    });
    this.mixer.setInstrumentAt(instrument5, 2);
    // this.mixer.setTrackVolume(3, 0.2);

    let instrument2 = new Instrument({
      origin: new THREE.Vector3(-2000, 0, 0),
      rotation: new THREE.Vector3(-1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.0055, 0.001, 0.0055).multiplyScalar(rotationSpeedScalar),
      audioPath: 'assets/audio/pipes-lo.mp3'
    });
    this.mixer.setTrackVolume(3, 0.5);
    this.mixer.setInstrumentAt(instrument2, 3);

    let instrument3 = new Instrument({
      origin: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Vector3(-1, 1, 1),
      rotationSpeed: new THREE.Vector3(0.0016, 0.0016, 0.0043).multiplyScalar(rotationSpeedScalar),
      audioPath: 'assets/audio/horn.mp3'
    });
    this.mixer.setInstrumentAt(instrument3, 4);
    this.mixer.tracks[4].addFx(new Tremolo({
      rate: 0.01,
      depth: 0.2,
      origin: 0.8
    }));

    // Add sparks
    let spark1 = new Spark({
      instrument1: instrument1,
      instrument2: instrument2,
      distance: 1600,
      sound: new Sound({
        audioPath: 'assets/audio/hihat.mp3',
        gain: 0.3
      })
    });
    this.mixer.setInstrumentAt(spark1, 11);
    this.mixer.tracks[11].setActivated(true);

    let spark2 = new Spark({
      instrument1: instrument1,
      instrument2: instrument4,
      distance: 1000,
      sound: new Sound({
        audioPath: 'assets/audio/bass-short.mp3',
        gain: 0.8
      }),
      vfxs: [new VFXLineRaster()]
    });
    this.mixer.setInstrumentAt(spark2, 12);
    this.mixer.tracks[12].setActivated(true);

    let spark3 = new Spark({
      instrument1: instrument2,
      instrument2: instrument5,
      distance: 800,
      sound: new Sound({
        audioPath: 'assets/audio/kick.mp3',
        gain: 1
      }),
      vfxs: [new VFXHitRing()]
    });
    this.mixer.setInstrumentAt(spark3, 13);
    this.mixer.tracks[13].setActivated(true);

    let spark4 = new Spark({
      instrument1: instrument4,
      instrument2: instrument5,
      distance: 800,
      sound: new Sound({
        audioPath: 'assets/audio/bitbell1.mp3',
        gain: 1
      }),
      // vfxs: [new VFXHitRing()]
    });
    this.mixer.setTrackVolume(14, 0.2);
    this.mixer.setInstrumentAt(spark4, 14);
    this.mixer.tracks[14].addFx(new Tremolo({
      rate: 0.0006,
      depth: 0.7,
      phase: -Math.PI * 0.5
    }));

    let spark5 = new Spark({
      instrument1: instrument2,
      instrument2: instrument3,
      distance: 800,
      sound: new Sound({
        audioPath: 'assets/audio/bitbell2.mp3',
        gain: 1
      }),
      // vfxs: [new VFXHitRing()]
    });
    this.mixer.setTrackVolume(15, 0.2);
    this.mixer.setInstrumentAt(spark5, 15);
    this.mixer.tracks[15].addFx(new Tremolo({
      rate: 0.001,
      depth: 0.7,
      phase: -Math.PI * 0.65
    }));

  }

  /**
   * Adds visual elements to world
   */
  populate() {
    for (let track of this.mixer.tracks) {
      if (track.instrument && track.instrument.visuals)
        this.container.add(track.instrument.visuals);
    }

    this.centerBall = new THREE.Mesh(new THREE.BoxGeometry( 120, 120, 120 ), new THREE.MeshBasicMaterial( { color: 0x333333 } ));
    this.container.add(this.centerBall);
  }

  /**
   * Next frame plz
   */
  update(time) {
    this.mixer.update(time);

    if (this.centerBall) {
      let ballScale = this.mixer.master.levelMeter.getAudioLevel();
      this.centerBall.scale.set(ballScale, ballScale, ballScale);

      let rot = this.centerBall.rotation;
      this.centerBall.rotation.set(rot.x + 0.01, rot.y + 0.01, rot.z + 0.01, rot.order);
    }
  }
};
