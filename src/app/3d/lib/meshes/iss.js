const SGP4 = require('sgp4');
const THREE = require('three');
const c = require('constants');
const m = require('math');

const Line = require('./line');

const SEGMENTS = 128;

const ISS_TLE = [
    '1 25544U 98067A   15256.76500793  .00042673  00000-0  62367-3 0  9995',
    '2 25544  51.6468   1.7516 0001021 349.4970 110.1741 15.55194220961827',
];

class ISS {
    constructor() {
        this.issSatRec = SGP4.twoline2rv(ISS_TLE[0], ISS_TLE[1], SGP4.wgs84());
        this.time = 1477077878157; // Hardcoded to October 21, 2:41pm EST

        let group = new THREE.Object3D();
        group.add(this._makeMesh());
        group.add(this._makeOrbitalLine());
        group.name = 'iss';

        group.update = this.update.bind(this);

        this.mesh = group;
    }

    _makeMesh() {
        let group = new THREE.Group();

        let geometry = new THREE.CylinderGeometry(2, 2, 250, 6);
        let material = new THREE.MeshPhongMaterial({
            transparent: true,
            specular: 0xefefd0,
        });
        group.add(new THREE.Mesh(geometry, material));

        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, 125, 30);
        group.add(new THREE.Mesh(geometry, material));

        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, 100, 30);
        group.add(new THREE.Mesh(geometry, material));

        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, 75, 30);
        group.add(new THREE.Mesh(geometry, material));
        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, 60, 30);
        group.add(new THREE.Mesh(geometry, material));


        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, 125, -30);
        group.add(new THREE.Mesh(geometry, material));

        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, 110, -30);
        group.add(new THREE.Mesh(geometry, material));

        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, 75, -30);
        group.add(new THREE.Mesh(geometry, material));
        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, 60, -30);
        group.add(new THREE.Mesh(geometry, material));


        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, -125, 30);
        group.add(new THREE.Mesh(geometry, material));

        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, -110, 30);
        group.add(new THREE.Mesh(geometry, material));

        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, -75, 30);
        group.add(new THREE.Mesh(geometry, material));
        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, -60, 30);
        group.add(new THREE.Mesh(geometry, material));


        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, -125, -30);
        group.add(new THREE.Mesh(geometry, material));

        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, -110, -30);
        group.add(new THREE.Mesh(geometry, material));

        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, -75, -30);
        group.add(new THREE.Mesh(geometry, material));
        geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.scale(1, 10, 50);
        geometry.translate(0, -60, -30);
        group.add(new THREE.Mesh(geometry, material));

        group.rotateZ(Math.PI / 4);
        group.rotateX(Math.PI / 4);

        group.name = 'station';

        return group;
    }

    _makeOrbitalLine() {
        let step = (92.65 * 1000 * 60) / SEGMENTS;
        let now = new Date().getTime();
        let vertices = [];

        for (let i = 0; i < SEGMENTS; i++) {
            let date = new Date(now + step * i);
            let position = this._getPositionForDate(date);
            vertices.push(new THREE.Vector3(position.x, position.y, position.z));
        }

        let mesh = (new Line.Dashed(vertices, 2)).mesh;
        mesh.material.opacityMultiplier = 0.5;
        return mesh;
    }

    update(percent) {
        if (percent < 0.002 || percent > 0.9) return;

        let time = this.time + m.minutes(180) * percent;
        let now = new Date(time);
        let position = this._getPositionForDate(now);
        this.mesh.getObjectByName('station').position.set(position.x, position.y, position.z);
    }

    _getPositionForDate(now) {
        let {position} = SGP4.propogate(this.issSatRec, now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())
        return position;
    }
}

module.exports = ISS;
