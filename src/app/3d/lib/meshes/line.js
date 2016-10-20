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
                depthTest: false,
            })
        );
    }
}

class LineSegmentGeometry {
    constructor(from, to, width = 5) {
        this.geometry = this._createGeometryFromEndpoints(from, to, width);
    }

    _createGeometryFromEndpoints(from, to, width) {
        let geometry = new THREE.Geometry();

        let lineDirection = new THREE.Vector3().subVectors(from, to);
        let growthDirection = new THREE.Vector3().crossVectors(from, to).normalize().multiplyScalar(width);

        console.log(growthDirection);

        let p1 = from;
        let p2 = to;

        for (let i = 0; i < 4; i++) {
            this._addSideFaceToGeometry(geometry, growthDirection, p1, p2, i);
            growthDirection.applyAxisAngle(lineDirection, m.degree(90));
            p1 = geometry.vertices[i * 4 + 2];
            p2 = geometry.vertices[i * 4 + 3];
        }

        return geometry;
    }

    _addSideFaceToGeometry(geometry, direction, p1, p2) {
        let p3 = new THREE.Vector3().addVectors(p1, direction);
        let p4 = new THREE.Vector3().addVectors(p2, direction);

        geometry.vertices.push(p1, p2, p3, p4);

        let vertexCount = geometry.vertices.length;
        geometry.faces.push(new THREE.Face3(vertexCount - 4, vertexCount - 3, vertexCount - 2), new THREE.Face3(vertexCount - 1, vertexCount - 2, vertexCount - 3));
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
