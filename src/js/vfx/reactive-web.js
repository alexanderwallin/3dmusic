
import THREE from 'three';
import TWEEN from 'tween.js';

/**
 * Reactive web VFX
 */
class VFXReactiveWeb {
  constructor(opts = {}) {
    this.opts = {
      numRows: 31,
      numCols: 31,
      size: 4000,
      origin: new THREE.Vector3(0, -200, 0),
      ...opts,
    };

    this.mesh = this.createWeb();
    // this.mesh.center();
    this.mesh.position.copy(this.opts.origin);
  }

  createWeb() {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(1, 1, 1),
      transparent: true,
      opacity: 0.2
    });

    const web = new THREE.Object3D();

    for (let i = 0; i < this.opts.numRows; i++) {
      const rowLineGeom = new THREE.Geometry();
      const rowLine = new THREE.Line(rowLineGeom, lineMaterial);
      rowLine.name = `line/row/${i}`;
      rowLine.userData.lineType = 'row';
      rowLine.userData.rowIndex = i;

      rowLine.geometry.vertices = this.getVerticesForLine(rowLine, 0, 0);

      web.add(rowLine);
    }

    for (let k = 0; k < this.opts.numCols; k++) {
      const colLineGeom = new THREE.Geometry();
      const colLine = new THREE.Line(colLineGeom, lineMaterial);
      colLine.name = `line/col/${k}`;
      colLine.userData.lineType = 'col';
      colLine.userData.colIndex = k;

      colLine.geometry.vertices = this.getVerticesForLine(colLine, 0, 0);

      web.add(colLine);
    }

    return web;
  }

  getVerticesForLine(line, time, audioLevel) {
    const vertices = [];

    const offsetX = -(this.opts.size / 2);
    const offsetZ = -(this.opts.size / 2);
    const audioLevelAmp = 50;
    const rowLength = this.opts.size / (this.opts.numRows + 1);

    if (line.userData.lineType === 'row') {
      const i = line.userData.rowIndex;

      for (let j = 0; j < this.opts.numCols; j++) {
        const yAmp = this.getLineAmpForPos(i, j);
        const yPol = this.getLinePolarityForPos(i, j);

        vertices.push(
          new THREE.Vector3(i * rowLength + offsetX, yAmp * audioLevelAmp * yPol * audioLevel, j * rowLength + offsetZ)
        );
      }
    }
    else {
      const k = line.userData.colIndex;

      for (let l = 0; l < this.opts.numRows; l++) {
        const yAmp = this.getLineAmpForPos(l, k);
        const yPol = this.getLinePolarityForPos(l, k);

        vertices.push(
          new THREE.Vector3(l * rowLength + offsetX, yAmp * audioLevelAmp * yPol * audioLevel, k * rowLength + offsetZ)
        );
      }
    }

    return vertices;
  }

  getLineAmpForPos(row, col) {
    const center = new THREE.Vector3(this.opts.numRows / 2, this.opts.numCols / 2, 0);
    const pos = new THREE.Vector3(row, col, 0);
    const distCenter = center.distanceTo(pos);

    return center.length() - distCenter;
  }

  getLinePolarityForPos(row, col) {
    return (col % 2 === 0 ? 1 : -1) * (row % 2 === 1 ? 1 : -1);
  }

  update(time, audioLevel) {
    // this.mesh.rotation.x = Math.sin(audioLevel) * 4;
    this.mesh.rotation.y = time / 10000; // Math.PI; // Math.asin(audioLevel);
    // this.mesh.rotation.z = time / 1000;

    for (let line of this.mesh.children) {
      line.geometry.vertices = this.getVerticesForLine(line, time, audioLevel);
      line.geometry.verticesNeedUpdate = true;
      line.material.opacity = Math.max(0.1, audioLevel);
    }
  }

  trigger(time, audioLevel) {
    console.log('VFXReactiveWeb', 'trigger', time, audioLevel);
    const _this = this;

    let tween = new TWEEN.Tween(({
        rotationX: this.mesh.rotation.x,
        rotationY: this.mesh.rotation.y,
        opacity: 1,
      }))
      .to({
        rotationX: audioLevel,
        rotationY: Math.asin(audioLevel),
        opacity: 0.2,
      }, 800)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function() {
        // _this.mesh.rotation.x = this.rotationX;
        // _this.mesh.rotation.y = this.rotationY;
        // _this.mesh.material.opacity = this.opacity;
      })
      .onComplete(function() {

      })
      .start();
  }
}

export default VFXReactiveWeb;
