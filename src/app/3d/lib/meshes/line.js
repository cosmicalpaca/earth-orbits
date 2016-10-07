const THREE = require('three');

class Line {
    constructor(from, to) {
        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(from);
        lineGeometry.vertices.push(to);

        this.mesh = new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({
                transparent: true,
            })
        );
    }
}

module.exports = Line;
