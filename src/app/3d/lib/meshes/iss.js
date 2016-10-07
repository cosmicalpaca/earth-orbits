const SGP4 = require('sgp4');
const THREE = require('three');
const c = require('constants');

const Line = require('./line');

const SEGMENTS = 128;

const ISS_TLE = [
    '1 25544U 98067A   15256.76500793  .00042673  00000-0  62367-3 0  9995',
    '2 25544  51.6468   1.7516 0001021 349.4970 110.1741 15.55194220961827',
];

class ISS {
    constructor() {
        this.issSatRec = SGP4.twoline2rv(ISS_TLE[0], ISS_TLE[1], SGP4.wgs84());
        this.time = new Date().getTime();

        let group = new THREE.Object3D();
        group.add(this._makeMesh());
        group.add(this._makeOrbitalLine());
        group.name = 'iss';

        this.mesh = group;
    }

    _makeMesh() {
        let geometry = new THREE.BoxGeometry(0.1, 0.01, 0.01);
        let material = new THREE.MeshBasicMaterial({transparent: true});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'station';
        return mesh;
    }

    _makeOrbitalLine() {
        let step = (92.65 * 1000 * 60) / SEGMENTS;
        let now = new Date().getTime();
        let vertices = [];

        for (let i = 0; i < SEGMENTS; i++) {
            let date = new Date(now + step * i);
            let position = this._getPositionForDate(date);
            vertices.push(new THREE.Vector3(position.x / 1000, position.y / 1000, position.z / 1000));
        }

        let mesh = (new Line.Dashed(vertices, 2)).mesh;
        return mesh;
    }

    update() {
        this.time = this.time + 1000 * 60 * 0.1;
        let now = new Date(this.time);
        let position = this._getPositionForDate(now);
        this.mesh.getObjectByName('station').position.set(position.x / 1000, position.y / 1000, position.z / 1000);
    }

    _getPositionForDate(now) {
        let {position} = SGP4.propogate(this.issSatRec, now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())
        return position;
    }
}

module.exports = ISS;
