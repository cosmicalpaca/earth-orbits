const THREE = require('three');
const Earth = require('./meshes/earth');
const Orbital = require('./meshes/orbital');
const f = require('flags');
const c = require('constants');
const m = require('math');

function createSceneObjects() {
    let objects = {};

    if (f.HELPERS) {
        objects.grid = new THREE.GridHelper(100, 100);
        objects.axis = new THREE.AxisHelper(10);
    }

    objects.ambientLight = new THREE.AmbientLight(0x777777);

    let directLight = new THREE.DirectionalLight(0xfcfade, 0.75);
    directLight.position.set(150, 20, 150);
    objects.directLight = directLight;

    let pointLight = new THREE.PointLight(0xadac9f);
    pointLight.position.set(0, 15, -30);
    objects.pointLight = pointLight;

    objects.earth = new Earth();

    let karmanline = (new Orbital.Line(c.karmanLine)).mesh;
    karmanline.material.opacity = 0;
    karmanline.rotateY(m.degree(25));
    objects.karmanline = karmanline;

    let karmanband = (new Orbital.Band(c.earthRadius, c.karmanLine)).mesh;
    karmanband.material.opacity = 0;
    karmanband.rotateY(m.degree(25));
    objects.karmanband = karmanband;

    return objects;
}

module.exports = {
    createSceneObjects,
};
