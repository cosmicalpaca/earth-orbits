const THREE = require('three');
const c = require('constants');
const f = require('flags');
const m = require('math');
const store = require('store');
const fonts = require('../fonts');
const SurfaceLocation = require('./surface-location');

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

        let marks = this._makeMarksMesh();
        earth.add(marks);

        earth.marks = marks;
        return earth;
    }

    _makeMarksMesh() {
        let city = new SurfaceLocation(47.60, 122.33);
        let water = new SurfaceLocation(47.90, 125.00);

        let connectionGeometry = new THREE.Geometry();
        connectionGeometry.vertices.push(m.latlongToCartesian(47.60, 122.33));
        connectionGeometry.vertices.push(m.latlongToCartesian(47.90, 125.00));

        let connection = new THREE.Line(
            connectionGeometry,
            new THREE.LineBasicMaterial({
                transparent: true,
                depthTest: false,
            })
        );

        let geometry = new THREE.TextGeometry('Seattle', {
            font: fonts.getFont(),
            size: 0.1,
            height: 0.005,
        });

        geometry.applyMatrix((new THREE.Matrix4()).makeRotationX(-0.9));
        geometry.applyMatrix((new THREE.Matrix4()).makeRotationZ(0.5));

        let p = m.latlongToCartesian(47.90, 123.00);
        p.multiplyScalar(1.01);
        geometry.translate(p.x, p.y, p.z);

        let material = new THREE.MeshBasicMaterial({
            transparent: true,
            depthTest: false,
        });

        let text = new THREE.Mesh(geometry, material);

        let marks = new THREE.Object3D();
        marks.add(city);
        marks.add(water);
        marks.add(connection);
        marks.add(text);

        return marks;
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
