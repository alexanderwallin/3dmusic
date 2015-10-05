
// App libs
import ctx from './audio-context'
import LevelMeter from './level-meter';

/**
 * Track
 */
export default class {
  constructor(index) {
    this.trackId = index;

    this.input = ctx.createGain();

    this.instrument = null;

    this.fxsInput = ctx.createGain();
    this.fxs = [];
    this.fxsOutput = ctx.createGain();

    this.volumeValue = 1;
    this.volume = ctx.createGain();
    this.volume.gain.value = this.volumeValue;

    this.levelMeter = new LevelMeter();

    this.input.connect(this.fxsInput);
    this.fxsInput.connect(this.fxsOutput);
    this.fxsOutput.connect(this.volume);
    this.volume.connect(this.levelMeter.input);

    this.output = this.volume;

    this.addGui();
  }

  /**
   * Adds track GUI
   */
  addGui() {
    this.$track = document.querySelector('#' + this.trackId);
    if (this.$track)
      this.$levelBar = this.$track.querySelector('.levelBar');
  }

  /**
   * Sets the instrument and connects it
   */
  setInstrument(instrument) {
    if (this.instrument) {
      this.instrument.output.disconnect();
    }
    this.input.disconnect();
    this.input.connect(instrument.input);

    this.instrument = instrument;
    this.instrument.output.connect(this.fxsInput);
  }

  /**
   * Adds an fx to the fx chain
   */
  addFx(fx) {
    console.log('addFx', fx);
    if (this.fxs.length == 0) {
      this.fxsInput.disconnect();
      this.fxsInput.connect(fx.input);
    }
    else {
      let lastFx = this.fxs[this.fxs.length - 1];
      console.log(lastFx.output, fx.input);
      lastFx.output.disconnect();
      lastFx.output.connect(fx.input);
    }

    fx.output.connect(this.fxsOutput);
    this.fxs.push(fx);
  }

  /**
   * Removes an fx
   */
  removeFx(fx) {
    this.fxs.splice(this.fxs.indexOf(fx), 1);
  }

  /**
   * Removes an fx at a given index
   */
  removeFxAt(index) {
    this.fxs.splice(index, 1);
  }

  /**
   * Sets the track volume
   */
  setVolume(volume) {
    this.volumeValue = volume;
    this.volume.gain.value = volume;
  }

  /**
   * Sets muted state
   */
  setMuted(mute) {
    this.volume.gain.value = mute ? 0 : this.volumeValue;
  }

  /**
   * Update
   */
  update(time) {
    if (this.instrument)
      this.instrument.update(time);

    for (let fx of this.fxs)
      if (fx.update)
        fx.update(time);

    if (this.$levelBar)
      this.$levelBar.style.height = (100 * this.levelMeter.getAudioLevel()) + '%';
  }
}