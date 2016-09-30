const THREE = require('three');
const math = require('math');
const c = require('constants');

/**
 * Creates a mesh that is on the surface of Earth
 * at given coordinates
 *
 * @returns {THREE.Mesh}
 */

class SurfaceLocation {
    /**
     * @param {Number} lat
     * @param {Number} long
     * @param {Number} [color]
     * @param {Number} [size]
     * @returns {THREE.Mesh}
     */
    constructor(lat, long, color = c.white, size = 0.01) {
        let geometry = new THREE.SphereGeometry(size, 16, 16);
        let material = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 1,
            color: color,
            depthTest: false,
        });

        let p = math.latlongToCartesian(lat, long);
        geometry.translate(p.x, p.y, p.z);
        
        let mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
}

module.exports = SurfaceLocation;
