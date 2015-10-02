
/**
 * Mixer
 */
export default class {
  constructor() {
    this.isMuted = false;

    this.setupControls();
  }

  setupControls() {
    window.addEventListener('keyup', (e) => {
      console.log(e.which, this.isMuted);
      if (e.which == 77)
        this.isMuted = !this.isMuted;
    });
  }
}