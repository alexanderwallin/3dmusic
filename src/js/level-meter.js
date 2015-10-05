
// App libs
import ctx from './audio-context';

/**
 * Audio level meter
 */
export default class {
  constructor() {
    this.currentLevel = 0;

    this.levelMeter = ctx.createScriptProcessor(256, 1, 1);
    this.levelMeter.onaudioprocess = (audioProcessingEvent) => {
      let input = audioProcessingEvent.inputBuffer.getChannelData(0);
      let len   = input.length;
      let total = 0;
      let i = 0;

      while (i < len)
        total += Math.abs(input[i++]);
      
      let rms = Math.sqrt(total / len);
      // let decibel = 20 * (Math.log(rms) / Math.log(10));
    
      this.currentLevel = rms;
    }

    this.input = this.levelMeter;
    this.output = ctx.createGain();
    this.output.gain.value = 0;

    this.input.connect(this.output);
    this.output.connect(ctx.destination);
  }

  getAudioLevel() {
    return this.currentLevel;
  }
}