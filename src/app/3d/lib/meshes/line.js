const THREE = require('three');

class Line {
    constructor(vertices, width = 1) {
        let lineGeometry = new THREE.Geometry();

        lineGeometry.vertices = vertices;

        this.mesh = new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({
                transparent: true,
                linewidth: width,
            })
        );
    }
}

class DashedLine {
    constructor(vertices, width = 1) {
        let lineGeometry = new THREE.Geometry();

        lineGeometry.vertices = vertices;
        lineGeometry.computeLineDistances();

        this.mesh = new THREE.Line(
            lineGeometry,
            new THREE.LineDashedMaterial({
                transparent: true,
                linewidth: width,
                dashSize: 0.02,
                gapSize: 0.02,
            })
        );
    }
}

module.exports = {
    Solid: Line,
    Dashed: DashedLine,
};
