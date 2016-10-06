const THREE = require('THREE');
const c = require('constants');

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
    constructor(from, to, color = c.white, width = 1) {
        let connectionGeometry = new THREE.Geometry();

        from.z = from.z * 1.01;
        to.z = to.z * 1.01;

        connectionGeometry.vertices.push(from);
        connectionGeometry.vertices.push(to);

        let mesh = new THREE.Line(
            connectionGeometry,
            new THREE.LineBasicMaterial({
                transparent: true,
            })
        );

        this.mesh = mesh;
    }
}

module.exports = SurfaceLine;
