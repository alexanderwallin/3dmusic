
import Sound from '../sound';
import ctx from '../audio-context';

/**
 * Reverb
 */
export default class {
  constructor(options) {
    options = options || {};

    let compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = options.threshold || -50;
    compressor.knee.value      = options.knee      || 40;
    compressor.ratio.value     = options.ratio     || 12;
    compressor.attack.value    = options.attack    || 0.002;
    compressor.release.value   = options.release   || 0.25;

    // The behavior of reduction differs between browsers, and might
    // be a float or an AudioParam. We'll have to leave it be for now.
    // compressor.reduction.value = options.reduction || -20;

    this.compressor = compressor;
    this.input = this.output = this.compressor;
  }
}
