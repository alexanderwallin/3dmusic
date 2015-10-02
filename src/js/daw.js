
// Vendor libs
import THREE from 'three';

// App libs
import Instrument from './instrument';

/**
 * DAW
 */
export default class {
  constructor() {
    this.createInstruments();
    this.populate();
  }

  createInstruments() {
    this.instruments = [];

    let instrument1 = new Instrument({
      origin: new THREE.Vector3(500, 0, 0)
    })
    this.instruments.push(instrument1);

    let instrument2 = new Instrument({
      origin: new THREE.Vector3(-500, 0, 0)
    })
    this.instruments.push(instrument2);
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
