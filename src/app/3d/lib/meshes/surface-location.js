const THREE = require('three');
const c = require('constants');

/**
 * Creates a mesh that is on the surface of Earth
 * at given coordinates
 */

class SurfaceLocation {
    /**
     * @param {THREE.Vector3} position
     * @param {Number} [color]
     * @param {Number} [size]
     */
    constructor(position, color = c.white, size = 10) {
        let geometry = new THREE.SphereGeometry(size, 6, 6);
        let material = new THREE.MeshBasicMaterial({
            transparent: true,
            depthTest: false,
            color: color,
        });

        geometry.translate(position.x, position.y, position.z + 20);

        let mesh = new THREE.Mesh(geometry, material);

        this.mesh = mesh;
    }
}

module.exports = SurfaceLocation;
