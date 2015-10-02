
// Vendor libs
import THREE from 'three';

/**
 * Spark
 */
export default class {
  constructor(options) {
    this.linesContainer = new THREE.Object3D();
    this.lineColor = new THREE.Color(Math.random(), Math.random(), Math.random());

    this.sound = options.sound;
    this.connect(options.instrument1, options.instrument2, options.distance);
  }

  connect(instrument1, instrument2, distance) {
    this.instrument1 = instrument1;
    this.instrument2 = instrument2;
    this.distance = distance;

    this.sparks = [];
    for (let instance1 of this.instrument1.instances) {
      for (let instance2 of this.instrument2.instances) {
        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(-100, 0, 100), new THREE.Vector3(200, 0, -300));
        let lineMaterial = new THREE.LineBasicMaterial({ color: this.lineColor, linewidth: 2 });
        let line = new THREE.Line(lineGeometry, lineMaterial);

        let sparkInstance = {
          a: instance1,
          b: instance2,
          isActive: false,
          sparkLine: line
        };

        this.sparks.push(sparkInstance);
        this.linesContainer.add(line);
      }
    }
  }

  update() {
    for (let spark of this.sparks) {
      spark.sparkLine.visible = spark.isActive;

      if (spark.isActive == false) {
        if (spark.a.position.distanceTo(spark.b.position) < this.distance) {

          // Update sound position and play it
          let soundPosition = spark.a.position.clone().lerp(spark.b.position, 0.5);
          this.sound.panner.setPosition(soundPosition.x, soundPosition.y, soundPosition.z);
          this.sound.hit();

          spark.isActive = true;
        }
      }
      else {
        if (spark.a.position.distanceTo(spark.b.position) >= this.distance) {
          spark.isActive = false;
        }
      }

      if (spark.isActive) {
        spark.sparkLine.geometry.vertices = [
          spark.a.position.clone(),
          spark.b.position.clone()
        ];
      }
      else {
        spark.sparkLine.geometry.vertices = [];
      }

      spark.sparkLine.geometry.verticesNeedUpdate = true;
    }
  }
}