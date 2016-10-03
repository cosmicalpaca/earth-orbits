const THREE = require('three');
const c = require('constants');
const f = require('flags');
const m = require('math');
const store = require('store');

const SurfaceLocation = require('./surface-location');
const SurfaceLine = require('./surface-line');
const Text = require('./text');

const SEGMENTS = 64;
const RADIUS = c.earthRadius;

/**
 * Earth class. Instances have two properties: planet and clouds
 */

class Earth {
    constructor(radius = RADIUS) {
        let earth = new THREE.Object3D();

        earth.add(this._makePlanetMesh(radius));
        earth.add(this._makeCloudsMesh(radius));

        let seattle = this._makeSeattleMesh();
        earth.add(seattle);
        earth.seattle = seattle;

        let nygroup = this._makeNYMesh();
        earth.add(nygroup);
        earth.nygroup = nygroup;

        return earth;
    }

    _makeSeattleMesh() {
        let seattleLocation = m.latlongToCartesian(47.60, 122.33);
        let seattleWaterLocation = m.latlongToCartesian(47.90, 125.00);

        let city = (new SurfaceLocation(seattleLocation)).mesh;
        let water = (new SurfaceLocation(seattleWaterLocation)).mesh;
        let connection = (new SurfaceLine(seattleLocation, seattleWaterLocation)).mesh;

        let seattle = new THREE.Object3D();

        [city, water, connection].forEach(o => seattle.add(o));

        return seattle;
    }

    _makeNYMesh() {
        let group = new THREE.Object3D();

        let nyLocation = m.latlongToCartesian(43.36, 72);
        let bostonLocation = m.latlongToCartesian(45.5, 70);

        let ny = (new SurfaceLocation(nyLocation)).mesh;
        group.add(ny);

        let boston = (new SurfaceLocation(bostonLocation)).mesh;
        group.add(boston);

        let connection = (new SurfaceLine(nyLocation, bostonLocation)).mesh;
        group.add(connection);

        return group;
    }

    /**
     * Make Mesh for the Planet itself
     */
    _makePlanetMesh(radius) {
        let loader = new THREE.TextureLoader();

        let mapTexture = loader.load(f.HD ? 'images/map_8k.jpg' : 'images/map_4k.jpg');
        let bumpTexture = loader.load(f.HD ? 'images/bump_8k.jpg' : 'images/bump_4k.jpg');
        let specTexture = loader.load(f.HD ? 'images/spec_8k.png' : 'images/spec_4k.png');

        if (f.anisotropy) {
            mapTexture.anisotropy = store.get('maxAnisotropy');
        }

        let geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS);
        let material = new THREE.MeshPhongMaterial({
            map: mapTexture,
            bumpMap: bumpTexture,
            bumpScale: 0.005,
            specularMap: specTexture,
            specular: new THREE.Color('grey'),
        });

        if (f.WIREFRAME) {
            material = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: 0x2194ce,
            });
        }

        return new THREE.Mesh(geometry, material);
    }

    /**
     * Make Mesh for Clouds above. Radius of Sphere
     * created for clouds is a bit bigger then planet's
     */
    _makeCloudsMesh(radius) {
        radius = radius + 0.02;

        let loader = new THREE.TextureLoader();

        let map = loader.load(f.HD ? 'images/clouds_8k.jpg' : 'images/clouds_4k.png');

        if (f.anisotropy) {
            map.anisotropy = store.get('maxAnisotropy');
        }

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
