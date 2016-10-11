const THREE = require('THREE');
const c = require('constants');
const m = require('math');

/**
 * Creates a mesh that is a line on a surface
 * between two positions
 */
class SurfaceLine {
    /**
     *
     * @param {THREE.Vector3} from
     * @param {THREE.Vector3} to
     * @param {Number} [color]
     * @param {Number} [width]
     */
    constructor(from, to, color = c.white, width = 0.005) {
        from.z = from.z + 0.02;
        to.z = to.z + 0.02;

        let geometry = this._createGeometryFromEndpoints(from, to, width);
        let material = new THREE.MeshBasicMaterial({
            color: color,
        });

        this.mesh = new THREE.Mesh(geometry, material);
    }

    _createGeometryFromEndpoints(from, to, width) {
        let geometry = new THREE.Geometry();

        let lineDirection = new THREE.Vector3().subVectors(from, to);
        let growthDirection = new THREE.Vector3().crossVectors(from, to).normalize().multiplyScalar(width);

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

    /**
     * Builds a geometry that is face perpendicular to two points
     *
     * @param geometry
     * @param direction
     * @param p1
     * @param p2
     * @private
     */
    _addSideFaceToGeometry(geometry, direction, p1, p2) {
        let p3 = new THREE.Vector3().addVectors(p1, direction);
        let p4 = new THREE.Vector3().addVectors(p2, direction);

        geometry.vertices.push(p1, p2, p3, p4);

        let vertexCount = geometry.vertices.length;
        geometry.faces.push(new THREE.Face3(vertexCount - 4, vertexCount - 3, vertexCount - 2), new THREE.Face3(vertexCount - 1, vertexCount - 2, vertexCount - 3));
    }
}

module.exports = SurfaceLine;
