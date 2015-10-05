
// App libs
import ctx from './audio-context'

/**
 * Sound
 */
export default class {
  constructor(options) {
    this.audioPath = options.audioPath;
    this.buffer    = null;
    this.source    = null;
    this.autoplay  = !!options.autoplay;

    this.output = ctx.createGain();
    this.output.gain.value = options.gain || 1;

    this.panner = ctx.createPanner();
    // this.panner.distanceModel = 'linear';
    this.panner.refDistance = 500;

    this.panner.connect(this.output);

    if (this.autoplay)
      this.load();
  }

  load() {
    if (this.buffer)
      return this.onLoad();

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
    this.source        = ctx.createBufferSource();
    this.source.loop   = this.loop;
    this.source.buffer = this.buffer;
    this.source.connect(this.panner);
    this.source.start();
  }

  play() {
    this.loop = true;
    this.load();
  }

  hit() {
    this.loop = false;
    this.load();
  }
}