
import Sound from '../sound';
import ctx from '../audio-context';

/**
 * Reverb
 */
export default class {
  constructor(options) {
    this.audioPath = 'assets/audio/concert-crowd.ogg';
    this.convolver = ctx.createConvolver();

    this.input = ctx.createGain();
    this.output = ctx.createGain();
    this.output.gain.value = options.gain || 0.3;

    this.input.connect(this.convolver);
    this.convolver.connect(this.output);

    this.load();
  }

  load() {
    let _this = this;
    
    // Load a sound file using an ArrayBuffer XMLHttpRequest.
    let request = new XMLHttpRequest();
    request.open('GET', this.audioPath, true);
    request.responseType = 'arraybuffer';
    request.onload = function(e) {

      // Create a buffer from the response ArrayBuffer.
      ctx.decodeAudioData(this.response, function(buffer) {
        _this.buffer = buffer;
        _this.onLoad();
      }, function() {
        console.error("Decoding the audio buffer failed");
      });
    };
    request.send();
  }

  onLoad() {
    this.convolver.buffer = this.buffer;
  }
}