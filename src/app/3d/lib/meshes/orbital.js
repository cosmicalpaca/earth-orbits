const THREE = require('three');
const c = require('constants');
const m = require('math');

const Text = require('./text');

const SEGMENTS = 128;

class OrbitalLine {
    constructor(radius, color = c.white, width = 0.01) {
        let geometry = new THREE.RingGeometry(radius - width, radius, SEGMENTS);

        let material = new THREE.MeshLambertMaterial({
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

        let material = new THREE.MeshLambertMaterial({
            color: color,
            transparent: true,
        });

        let mesh = new THREE.Mesh(geometry, material);

        this.mesh = mesh;
    }
}

class OrbitMeasurement {
    constructor(innerRadius, outerRadius, text) {
        let group = new THREE.Object3D();

        group.add(this._makeLine(innerRadius, outerRadius));
        group.add(this._makeLegend(innerRadius, outerRadius, text));

        this.mesh = group;
    }

    _makeLine(innerRadius, outerRadius) {
        let length = outerRadius - innerRadius;

        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        lineGeometry.vertices.push(new THREE.Vector3(length, 0, 0));
        lineGeometry.translate(innerRadius, 0, 0);

        return new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({
                transparent: true,
            })
        );
    }

    _makeLegend(innerRadius, outerRadius, label) {
        let text = (new Text.Sprite(label, 4)).mesh;

        text.material.rotation = m.degree(86);
        text.translateOnAxis(new THREE.Vector3(1, 0, 0), outerRadius + 0.15);

        return text;
    }
}

module.exports = {
    Line: OrbitalLine,
    Band: OrbitalBand,
    Measurement: OrbitMeasurement,
};
