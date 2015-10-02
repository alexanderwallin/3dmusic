
// Vendor libs
import THREE from 'three';

// App libs
import DAW from './daw';

/**
 * Room
 */
export default class {
  constructor(opts) {
    this.opts = opts;
    this.init();
    this.initDaw();
    this.resizing();
    this.animate();
  }

  init() {

    // Camera
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    // this.camera.position.x = 200;
    this.camera.position.y = 100;
    this.camera.position.z = 1000;

    // Scene
    this.scene = new THREE.Scene();

    // Axis helper
    this.axisHelper = new THREE.AxisHelper( 600 );
    this.scene.add( this.axisHelper );

    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.opts.container.appendChild( this.renderer.domElement );
  }

  initDaw() {
    this.daw = new DAW();
    this.scene.add(this.daw.container);
  }

  resize() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w/h;
    this.camera.updateProjectionMatrix();
  }

  resizing() {
    window.addEventListener('resize', () => {
      this.resize();
    });

    this.resize();
  }

  animate() {
    requestAnimationFrame( this.animate.bind(this) );
    this.daw.update();
    this.renderer.render( this.scene, this.camera );
  }
};
