
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
    this.instruments.push(new Instrument());
  }

  populate() {
    this.container = new THREE.Object3D();

    for (let instrument of this.instruments) {
      this.container.add(instrument.visuals);
    }
  }

  update() {
    for (let instrument of this.instruments) {
      instrument.update();
    }
  }
};
