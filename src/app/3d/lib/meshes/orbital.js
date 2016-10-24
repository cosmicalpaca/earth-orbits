const THREE = require('three');
const c = require('constants');
const m = require('math');

const Text = require('./text');
const Line = require('./line');

const SEGMENTS = 128;

class OrbitalLine {
    constructor(radius, width = 10, color = c.white) {
        let geometry = new THREE.RingGeometry(radius - width, radius, SEGMENTS);

        let material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
        });

        let mesh = new THREE.Mesh(geometry, material);

        this.mesh = mesh;
    }
}

class OrbitalBand {
    constructor(innerRadius, outerRadius, color = c.white) {
        let geometry = new THREE.RingGeometry(innerRadius, outerRadius, SEGMENTS);

        let material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            depthTest: false,
        });

        let mesh = new THREE.Mesh(geometry, material);

        this.mesh = mesh;
    }
}

class OrbitMeasurement {
    constructor(innerRadius, outerRadius, text) {
        let group = new THREE.Object3D();

        group.add(this._makeLine(innerRadius, outerRadius));
        group.add(this._makeLegend(outerRadius, text));
        group.add(this._makeLegendUnderline(outerRadius));

        this.mesh = group;
    }

    _makeLine(innerRadius, outerRadius) {
        let length = outerRadius - innerRadius;
        let {mesh} = new Line.Solid([new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0)]);

        mesh.geometry.translate(innerRadius, 0, 0);

        return mesh;
    }

    _makeLegend(outerRadius, label) {
        let {mesh, size} = (new Text.Sprite(label, 4));

        this.size = size;

        mesh.translateOnAxis(new THREE.Vector3(1, -0.01, 0), outerRadius + 15);
        mesh.translateOnAxis(new THREE.Vector3(1, -1, 0), this.size + 30);

        mesh.rotation.setFromVector3(new THREE.Vector3(0, 0, m.degree(-45)));

        return mesh;
    }

    _makeLegendUnderline(outerRadius) {
        let direction = new THREE.Vector3(1, -1, 0);
        let length = this.size;
        let endPointPosition = direction.multiplyScalar(length);

        let {mesh} = (new Line.Solid([new THREE.Vector3(0, 0, 0), endPointPosition]));

        mesh.geometry.translate(outerRadius, 0, 0);

        return mesh;
    }
}

module.exports = {
    Line: OrbitalLine,
    Band: OrbitalBand,
    Measurement: OrbitMeasurement,
};
