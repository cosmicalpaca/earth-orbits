const THREE = require('three');

const SEGMENTS = 64;
const RADIUS = 6.371;

/**
 * Earth class. Instances have two properties: planet and clouds
 */

class Earth {
    constructor(radius = RADIUS) {
        this.planet = this.planetMesh(radius);
        this.clouds = this.cloudsMesh(radius);
    }

    /**
     * Make Mesh for the Planet itself
     */
    planetMesh(radius) {
        let loader = new THREE.TextureLoader();

        // let mapTexture = loader.load('images/map_w_clouds_8k.jpg');
        let mapTexture = loader.load('images/map_8k.jpg');
        let bumpTexture = loader.load('images/bump_8k.jpg');
        let specTexture = loader.load('images/spec_8k.png');

        mapTexture.anisotropy = 16;

        let geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS);
        let material = new THREE.MeshPhongMaterial({
            map: mapTexture,
            bumpMap: bumpTexture,
            bumpScale: 0.005,
            specularMap: specTexture,
            specular: new THREE.Color('grey'),
        });

        return new THREE.Mesh(geometry, material);
    }

    /**
     * Make Mesh for Clouds above. Radius of Sphere
     * created for clouds is a bit bigger then planet's
     */
    cloudsMesh(radius) {
        radius = radius + 0.05;

        let loader = new THREE.TextureLoader();

        let map = loader.load('images/clouds_8k.jpg');
        map.anisotropy = 16;

        let geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS);
        let material = new THREE.MeshBasicMaterial({
            map: map,
        });

        material.transparent = true;
        material.blending = THREE.AdditiveBlending;

        return new THREE.Mesh(geometry, material);
    }
}

module.exports = Earth;
