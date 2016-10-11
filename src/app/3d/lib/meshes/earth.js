const THREE = require('three');
const c = require('constants');
const f = require('flags');
const m = require('math');
const store = require('store');

const vertexShader = require('../shaders/earth/vertex.glsl');
const fragmentShader = require('../shaders/earth/fragment.glsl');

const SurfaceLocation = require('./surface-location');
const SurfaceLine = require('./surface-line');
const Text = require('./text');

const SEGMENTS = 64;
/**
 * Earth class. Instances have two properties: planet and clouds
 */

class Earth {
    constructor() {
        let earth = new THREE.Object3D();

        earth.add(this._makePlanetMesh(c.earthRadius));
        earth.add(this._makeCloudsMesh(c.earthAtmoshpere));
        earth.name = 'earth';

        let seattle = this._makeSeattleMesh();
        earth.add(seattle);

        let ny = this._makeNYMesh();
        earth.add(ny);

        if (f.shaders) earth.add(this._shaderGlow(c.earthRadius));

        this.mesh = earth;
    }

    _makeSeattleMesh() {
        let group = new THREE.Object3D();

        let seattleLocation = m.latlongToCartesian(47.60, 122.33);
        let seattleWaterLocation = m.latlongToCartesian(47.90, 125.00);

        let seattle = (new SurfaceLocation(seattleLocation)).mesh;
        group.add(seattle);

        let water = (new SurfaceLocation(seattleWaterLocation)).mesh;
        group.add(water);

        let connection = (new SurfaceLine(seattleLocation, seattleWaterLocation)).mesh;
        group.add(connection);

        let text = (new Text.SpriteTextOnSurface('Seattle', 47.60, 120.33)).mesh;
        group.add(text);

        group.children.forEach(o => o.material.opacity = 0);

        group.name = 'seattle';
        return group;
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

        let nyLabel = (new Text.SpriteTextOnSurface('New York', 41.75, 71.75)).mesh;
        group.add(nyLabel);

        let bostonLabel = (new Text.SpriteTextOnSurface('Boston    ', 45.9, 68.5)).mesh;
        group.add(bostonLabel);

        group.children.forEach(o => o.material.opacity = 0);

        group.name = 'ny';
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
        let loader = new THREE.TextureLoader();

        let map = loader.load(f.HD ? 'images/clouds_8k.jpg' : 'images/clouds_4k.png');

        if (f.anisotropy) {
            map.anisotropy = store.get('maxAnisotropy');
        }

        let geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS);
        let material = new THREE.MeshBasicMaterial({
            map: map,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
        });

        return new THREE.Mesh(geometry, material);
    }

    _shaderGlow() {
        const intensity = 0.35;
        const fade = 10;
        const color = new THREE.Color(0x93cfef);
        const viewVector = new THREE.Vector3(-3, 6, 10);

        let material = new THREE.ShaderMaterial(
            {
                uniforms: {
                    c: {
                        type: "f",
                        value: intensity,
                    },
                    p: {
                        type: "f",
                        value: fade,
                    },
                    glowColor: {
                        type: "c",
                        value: color,
                    },
                    viewVector: {
                        type: "v3",
                        value: viewVector,
                    },
                },
                vertexShader,
                fragmentShader,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                transparent: true,
            });

        let geometry = new THREE.SphereGeometry(c.earthAtmoshpere, SEGMENTS, SEGMENTS);

        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'glow';

        return mesh;
    }
}

module.exports = Earth;
