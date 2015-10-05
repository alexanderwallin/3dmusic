
// App libs
import ctx from '../audio-context';
import LFO from '../lfo';

/**
 * FX: Tremolo
 */
export default class {
  constructor(options) {
    this.lfo = new LFO(options);

    let gain = ctx.createGain();
    this.input = this.output = gain;
  }

  update(time) {
    this.lfo.update(time);
    this.output.gain.value = (1 + this.lfo.value) / 2;
  }
}