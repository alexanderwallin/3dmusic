
// App libs
import ctx from './audio-context'

/**
 * Track
 */
export default class {
  constructor() {
    this.input = ctx.createGain();

    this.instrument = null;

    this.fxsInput = ctx.createGain();
    this.fxs = [];
    this.fxsOutput = ctx.createGain();

    this.volumeValue = 1;
    this.volume = ctx.createGain();
    this.volume.gain.value = this.volumeValue;

    this.input.connect(this.fxsInput);
    this.fxsInput.connect(this.fxsOutput);
    this.fxsOutput.connect(this.volume);

    this.output = this.volume;
  }

  setInstrument(instrument) {
    if (this.instrument) {
      this.instrument.output.disconnect();
    }
    this.input.disconnect();
    this.input.connect(instrument.input);

    this.instrument = instrument;
    this.instrument.output.connect(this.fxsInput);
  }

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

  removeFx(fx) {
    this.fxs.splice(this.fxs.indexOf(fx), 1);
  }

  removeFxAt(index) {
    this.fxs.splice(index, 1);
  }

  setVolume(volume) {
    this.volumeValue = volume;
    this.volume.gain.value = volume;
  }

  setMuted(mute) {
    this.volume.gain.value = mute ? 0 : this.volumeValue;
  }
}