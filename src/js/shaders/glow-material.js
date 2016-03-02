
import THREE from 'three';

export default class GlowMaterial {
  constructor({ color, viewVector }) {

    // create custom material from the shader code above
    // that is within specially labeled script tags
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        c: { type: "f", value: 0.1 },
        p: { type: "f", value: 2.7 },
        glowColor: { type: "c", value: color },
        viewVector: { type: "v3", value: viewVector }
      },
      vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.1
    });
  }
}
