
import Sound from '../sound';
import ctx from '../audio-context';

/**
 * Reverb
 */
export default class {
  constructor(options) {
    let compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.reduction.value = -20;
    compressor.attack.value = 0.002;
    compressor.release.value = 0.25;

    this.compressor = compressor;
    this.input = this.output = this.compressor;
  }
}