const THREE = require('three');
const c = require('constants');

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
    constructor(innerRadius, outerRadius, color=c.white) {
        let geometry = new THREE.RingGeometry(innerRadius, outerRadius, SEGMENTS);

        let material = new THREE.MeshLambertMaterial({
            color: color,
            transparent: true,
        });

        let mesh = new THREE.Mesh(geometry, material);

        this.mesh = mesh;
    }
}

module.exports = {
    Line: OrbitalLine,
    Band: OrbitalBand,
};
