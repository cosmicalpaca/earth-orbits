const THREE = require('three');
const math = require('math');

/**
 * Creates a mesh that is on the surface of Earth
 * at given coordinates
 */

class SurfaceLocation {
    constructor(lat, long, options = {color: 0x99ff99, size: 0.05}) {
        let geometry = new THREE.SphereGeometry(options.size, 16, 16);
        let material = new THREE.MeshBasicMaterial({color: options.color});

        let p = math.latlongToCartesian(lat, long);
        geometry.translate(p.x, p.y, p.z);
        
        let mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
}

module.exports = SurfaceLocation;
