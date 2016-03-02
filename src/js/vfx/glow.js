
import THREE from 'three';
import TWEEN from 'tween.js';

import GlowMaterial from '../shaders/glow-material';
import Room from '../room';

/**
 * Glow effect
 */
class Glow {
  constructor(id, parent, opts) {
    this.id = id;
    this.parent = parent;
    this.opts = {
      debounce: 100,
      ...opts,
    };

    console.log('Glow', this.opts);

    // 3D object
    // const glowGeometry = new THREE.CircleGeometry( 100, 20 );
    // const glowMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color(1, 1, 1), transparent: true, opacity: 0.5 } );
    // const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    // glow.name = `glow_${id}`;
    // this.mesh = glow;

    const glowMaterial = new GlowMaterial({
      color: parent.material.color.clone(),
      viewVector: new THREE.Vector3(0, 0, 1000),
    }).material;

    console.log({ glowMaterial });
    glowMaterial.opacity = 0;

    this.mesh = new THREE.Mesh( parent.geometry.clone(), glowMaterial.clone() );
    this.mesh.position.copy(parent.position);
    this.mesh.scale.multiplyScalar(1.2);

    // Tweening
    this.tween = null;
  }

  getScaleFromAudioLevel(audioLevel) {
    return Math.max(0.01, 8 * audioLevel);
  }

  update(time, audioLevel) {
    this.mesh.position.copy(this.parent.position);

    this.mesh.material.opacity = 0; // Math.abs(Math.sin(time / 1000));
    // console.log(this.mesh.material.opacity);

    if (!this.tween) {
      const nextScale = this.getScaleFromAudioLevel(audioLevel);

      if (nextScale !== this.mesh.scale.x) {
        this.animate(nextScale);
      }
    }
  }

  animate(toScale) {
    const _this = this;
    // return;

    this.mesh.scale.set(toScale, toScale, toScale);
    return;

    this.tween = new TWEEN.Tween({ scale: this.mesh.scale.x })
      .to({ scale: toScale }, this.opts.debounce)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function() {
        _this.mesh.scale.set(this.scale, this.scale, this.scale);
        // _this.mesh.material.opacity = this.scale;
      })
      .onComplete(() => {
        _this.tween = null;
      })
      .start();
  }
}

export default Glow;
