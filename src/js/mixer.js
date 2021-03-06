
// App libs
import Track from './track';
import { storage } from './storage';

let numTracks = 16;

/**
 * Mixer
 */
export default class {
  constructor() {
    this.isActivated = true;
    this.isMuted = storage.getOrSet('master/muted', false);

    // Master track
    this.master = new Track('master');
    this.master.setMuted(this.isMuted);

    // Tracks
    this.tracks = []; //new Array(numTracks);
    for (let i = 0; i < numTracks; i++) {
      let track = new Track(`track${i + 1}`);
      track.output.connect(this.master.input);
      this.tracks[i] = track;
    }

    // Controls
    this.setupControls();
  }

  /**
   * Sets up controls
   */
  setupControls() {
    this.isMixerVisible = false;
    this.$mixer = document.querySelector('#mixer');

    window.addEventListener('keyup', (e) => {
      if (e.which == 77)
        this.toggleMute();

      if (e.which >= 48 && e.which <= 57) {
        let trackIndex = e.which - 49;
        if (e.altKey)
          trackIndex += 10;

        this.tracks[trackIndex].toggleActivated();
      }

      if (e.which == 86) {
        this.isMixerVisible = !this.isMixerVisible;
        this.$mixer.classList.toggle('visible', this.isMixerVisible);
      }
    });
  }

  /**
   * Toggles mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.master.setMuted(this.isMuted);
    storage.set('master/muted', this.isMuted);
  }

  /**
   * Sets an instrument to a track
   */
  setInstrumentAt(instrument, index) {
    this.tracks[index].setInstrument(instrument);
    // this.tracks[index].setActivated(storage.getOrSet(`track${index+1}/activated`, false));
  }

  /**
   * Sets a track's volume
   */
  setTrackVolume(index, volume) {
    this.tracks[index].setVolume(volume);
  }

  /**
   * Update
   */
  update(time) {
    for (let track of this.tracks)
      track.update(time);

    this.master.update(time);
  }
}
