
// Vendor libs
import THREE from 'three';
import TWEEN from 'tween.js';

// let ;

/**
 * VFX: Line raster
 */
export default class {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.position.set(0, 0, -200);
    // this.mesh.rotation = Math.random() * Math.PI * 2;

    this.numLines = 60;
  }

  trigger() {
    this.start();
  }

  start() {
    let linesContainer = new THREE.Object3D();

    let opacity       = 0.3 + Math.random() * 0.3;
    let rotationAxis  = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    let rotationSpeed = 0.01;

    let material = new THREE.LineBasicMaterial({
      color: new THREE.Color(Math.random(), Math.random(), Math.random()).multiplyScalar(1.5),
      transparent: true,
      opacity: opacity
    });

    for (let i = 0; i < this.numLines; i++) {
      let lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(
        new THREE.Vector3(-3000, -1000 + (i/this.numLines) * 2000, 0),
        new THREE.Vector3(3000, -1000 + (i/this.numLines) * 2000, 0)
      );
      let line = new THREE.Line(lineGeometry, material);

      linesContainer.add(line);
    }

    this.mesh.add(linesContainer);

    let _this = this;

    let tween = new TWEEN.Tween({ alpha: opacity })
      .to({ alpha: 0 }, 800)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function() {
        for (let line of linesContainer.children) {
          line.material.opacity = this.alpha;
        }

        linesContainer.rotateOnAxis(rotationAxis, rotationSpeed);
      })
      .onComplete(() => {
        _this.mesh.remove(linesContainer);
      })
      .start();
  }
}