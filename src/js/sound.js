
/**
 * Sound
 */
export default class {
  constructor(options) {
    this.ctx       = options.ctx;
    this.audioPath = options.audioPath;
    this.buffer    = null;
    this.source    = null;
    this.output    = options.output;
    this.autoplay  = options.autoplay;

    this.gain = this.ctx.createGain();

    this.panner = this.ctx.createPanner();
    this.panner.distanceModel = 'linear';

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
      _this.ctx.decodeAudioData(this.response, function(buffer) {
        _this.buffer = buffer;
        _this.onLoad();
      }, function() {
        console.error("Decoding the audio buffer failed");
      });
    };
    request.send();
  }

  onLoad() {
    this.source        = this.ctx.createBufferSource();
    this.source.loop   = true;
    this.source.buffer = this.buffer;

    this.source.connect(this.panner);
    this.panner.connect(this.output);

    if (this.autoplay)
      this.play();
  }

  play() {
    this.source.start();
  }
}