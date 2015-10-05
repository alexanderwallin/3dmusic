
/**
 * LFO (multi-purpose)
 */
export default class {
  constructor(options) {
    options = options || {};

    this.shape = options.shape || Math.sin;
    this.rate  = options.rate  || 1.0;
    this.phase = options.phase || 0;
    this.depth = options.depth || 1;
    this.origin = options.origin || 0;

    this.update();
  }

  update(time) {
    this.value = this.getValue(time);
  }

  getValue(time) {
    return this.origin + this.depth * this.shape(this.phase + (time / (1/this.rate)));
  }
}