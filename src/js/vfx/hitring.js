
// Vendor libs
import THREE from 'three';
import TWEEN from 'tween.js';

// let ;

/**
 * VFX: Hit ring
 */
export default class {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.position.set(0, 0, -2000);
  }

  trigger() {
    let _this = this;

    var material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(Math.random(), Math.random(), Math.random()).multiplyScalar(0.5),
      transparent: true,
      opacity: 1
    });

    var radius = 0;
    var segments = 32;

    var circleGeometry = new THREE.CircleGeometry( radius, segments );
    circleGeometry.dynamic = true;
    var circle = new THREE.Mesh( circleGeometry, material );

    this.mesh.add(circle);

    let tween = new TWEEN.Tween({ scale: 0, alpha: 1 })
      .to({ scale: 1, alpha: 0 }, 800)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function() {
        var newCircleGeometry = new THREE.CircleGeometry( this.scale * 10000, segments );
        for ( var i = 0, l = circle.geometry.vertices.length; i < l; i ++ ) {
          circle.geometry.vertices[ i ].copy(newCircleGeometry.vertices[i]);
        }
        circle.geometry.verticesNeedUpdate = true;
        // circle.material.opacity = this.alpha;
      })
      .onComplete(() => {
        if (this.mesh.children.length > 2)
          this.mesh.remove(this.mesh.children[0]);
      })
      .start();
  }
}