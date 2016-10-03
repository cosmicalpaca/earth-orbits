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
    constructor(position, color = c.white, size = 0.01) {
        let geometry = new THREE.SphereGeometry(size, 16, 16);
        let material = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 1,
            color: color,
            depthTest: false,
        });

        geometry.translate(position.x, position.y, position.z);

        let mesh = new THREE.Mesh(geometry, material);

        this.mesh = mesh;
    }
}

module.exports = SurfaceLocation;
