
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
    this.runDaw();
  }

  init() {
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.x = 200;
    this.camera.position.y = 100;
    this.camera.position.z = 1000;

    this.scene = new THREE.Scene();

    let geometry = new THREE.BoxGeometry( 200, 200, 200 );
    let material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    this.mesh = new THREE.Mesh( geometry, material );
    this.scene.add( this.mesh );

    this.axisHelper = new THREE.AxisHelper( 600 );
    this.scene.add( this.axisHelper );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.opts.container.appendChild( this.renderer.domElement );

    this.resizing();
    this.animate();
  }

  runDaw() {
    this.daw = new DAW();
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

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

    this.renderer.render( this.scene, this.camera );
  }
};
