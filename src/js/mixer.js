
// App libs
import Track from './track';

let numTracks = 16;

/**
 * Mixer
 */
export default class {
  constructor() {
    this.isMuted = false;

    this.master = new Track();

    this.tracks = new Array(numTracks);
    for (let i = 0; i < numTracks; i++) {
      let track = new Track();
      track.output.connect(this.master.input);
      this.tracks[i] = track;
    }

    this.setupControls();
  }

  setupControls() {
    window.addEventListener('keyup', (e) => {
      if (e.which == 77)
        this.toggleMute();
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.master.setMuted(this.isMuted);
  }

  setInstrumentAt(instrument, index) {
    this.tracks[index].setInstrument(instrument);
  }

  setTrackVolume(index, volume) {
    this.tracks[index].setVolume(volume);
  }
}