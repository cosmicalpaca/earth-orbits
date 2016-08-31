const THREE = require('three');
const math = require('../utils/math');

/**
 * Creates a mesh that is on the surface of Earth
 * at given coordinates
 */

class SurfaceLocation {
    constructor(lat, long, options = {color: 0x99ff99, size: 0.05}) {
        let mesh = new THREE.Mesh(
            new THREE.SphereGeometry(options.size, 16, 16),
            new THREE.MeshBasicMaterial({color: options.color})
        );

        mesh.position.copy(math.latlongToCartesian(lat, long));

        return mesh;
    }
}

module.exports = SurfaceLocation;
