const THREE = require('three');
const c = require('constants');

class OrbitalLine {
    constructor(radius, color = c.white) {
        let geometry = new THREE.RingGeometry(radius * 0.99, radius * 1.01, 32);

        let material = new THREE.MeshLambertMaterial({
            color: color,
        });

        let mesh = new THREE.Mesh(geometry, material);

        this.mesh = mesh;
    }
}

class OrbitalBand {
    constructor(innerRadius, outerRadius, color = c.white) {
        let geometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);

        let material = new THREE.MeshLambertMaterial({
            color: color,
        });

        let mesh = new THREE.Mesh(geometry, material);

        this.mesh = mesh;
    }
}

module.exports = {
    line: OrbitalLine,
    band: OrbitalBand,
};
